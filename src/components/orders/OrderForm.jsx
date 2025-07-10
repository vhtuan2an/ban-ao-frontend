import { useState, useEffect } from 'react';
import customerApi from '../../services/api/customerApi';
import productApi from '../../services/api/productApi';

const OrderForm = ({ isOpen, onClose, order, onSave }) => {
  const [formData, setFormData] = useState({
    customer: '',
    items: [],
    status: 'Đã tạo',
    paymentMethod: 'Tiền mặt',
    paymentStatus: 'Chưa thanh toán',
    notes: ''
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

  const statusOptions = ['Đã tạo', 'Đang xử lý', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'];
  const paymentMethods = ['Tiền mặt', 'Chuyển khoản', 'Thẻ tín dụng'];
  const paymentStatusOptions = ['Chưa thanh toán', 'Đã thanh toán', 'Hoàn tiền'];

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (order) {
      setFormData({
        customer: order.customer?._id || order.customer || '',
        items: order.items || [],
        status: order.status || 'Đã tạo',
        paymentMethod: order.paymentMethod || 'Tiền mặt',
        paymentStatus: order.paymentStatus || 'Chưa thanh toán',
        notes: order.notes || ''
      });
    } else {
      setFormData({
        customer: '',
        items: [],
        status: 'Đã tạo',
        paymentMethod: 'Tiền mặt',
        paymentStatus: 'Chưa thanh toán',
        notes: ''
      });
    }
    setErrors({});
  }, [order, isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAllCustomers();
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        product: '',
        teamName: '',
        category: '',
        size: '',
        quantity: 1,
        price: 0,
        subtotal: 0
      }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      // Auto-fill product details when product is selected
      if (field === 'product' && value) {
        const selectedProduct = products.find(p => p._id === value);
        if (selectedProduct) {
          newItems[index] = {
            ...newItems[index],
            teamName: selectedProduct.teamName,
            category: selectedProduct.category,
            size: selectedProduct.size,
            price: selectedProduct.price
          };
        }
      }

      // Calculate subtotal when quantity or price changes
      if (field === 'quantity' || field === 'price') {
        const quantity = field === 'quantity' ? parseInt(value) || 0 : newItems[index].quantity;
        const price = field === 'price' ? parseFloat(value) || 0 : newItems[index].price;
        newItems[index].subtotal = quantity * price;
      }

      return { ...prev, items: newItems };
    });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer) newErrors.customer = 'Vui lòng chọn khách hàng';
    if (formData.items.length === 0) newErrors.items = 'Vui lòng thêm ít nhất một sản phẩm';
    
    formData.items.forEach((item, index) => {
      if (!item.product) newErrors[`item_${index}_product`] = 'Vui lòng chọn sản phẩm';
      if (!item.quantity || item.quantity <= 0) newErrors[`item_${index}_quantity`] = 'Số lượng phải lớn hơn 0';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData = {
      ...formData,
      totalAmount: calculateTotal(),
      ...(order && { id: order._id })
    };

    onSave(orderData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{order ? 'Sửa đơn hàng' : 'Tạo đơn hàng mới'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer">Khách hàng *</label>
              <select
                id="customer"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className={errors.customer ? 'error' : ''}
              >
                <option value="">Chọn khách hàng</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
              {errors.customer && <span className="error-message">{errors.customer}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="paymentMethod">Phương thức thanh toán</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentStatus">Trạng thái thanh toán</label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                {paymentStatusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Order Items */}
          <div className="form-group">
            <div className="order-items-header">
              <label>Sản phẩm *</label>
              <button type="button" onClick={handleAddItem} className="btn btn-primary btn-sm">
                Thêm sản phẩm
              </button>
            </div>
            {errors.items && <span className="error-message">{errors.items}</span>}

            <div className="order-items">
              {formData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-row">
                    <div className="form-group">
                      <select
                        value={item.product}
                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                        className={errors[`item_${index}_product`] ? 'error' : ''}
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - {product.teamName} ({product.size})
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_product`] && 
                        <span className="error-message">{errors[`item_${index}_product`]}</span>
                      }
                    </div>

                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Số lượng"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        className={errors[`item_${index}_quantity`] ? 'error' : ''}
                      />
                      {errors[`item_${index}_quantity`] && 
                        <span className="error-message">{errors[`item_${index}_quantity`]}</span>
                      }
                    </div>

                    <div className="form-group">
                      <input
                        type="number"
                        placeholder="Giá"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        min="0"
                        step="1"
                      />
                    </div>

                    <div className="subtotal">
                      {new Intl.NumberFormat('vi-VN').format(item.subtotal || 0)} $
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Xóa
                    </button>
                  </div>
                  
                  {item.teamName && (
                    <div className="item-details">
                      <span>Đội: {item.teamName}</span>
                      <span>Loại: {item.category}</span>
                      <span>Size: {item.size}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {formData.items.length > 0 && (
              <div className="order-total">
                <strong>Tổng cộng: {new Intl.NumberFormat('vi-VN').format(calculateTotal())} $</strong>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Ghi chú</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Ghi chú thêm về đơn hàng..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {order ? 'Cập nhật' : 'Tạo đơn hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;