import { useState, useEffect } from 'react';
import OrderList from '../components/orders/OrderList';
import OrderForm from '../components/orders/OrderForm';
import OrderDetails from '../components/orders/OrderDetails';
import SearchBar from '../components/SearchBar';
import orderApi from '../services/api/orderApi';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      console.log('Full API response:', response); // Debug để xem cấu trúc dữ liệu
    
    // Kiểm tra cấu trúc dữ liệu trả về
    let ordersData = [];
    
    if (response.data) {
      // Kiểm tra các cấu trúc có thể có
      if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      } else {
        console.warn('Unexpected data structure:', response.data);
        ordersData = [];
      }
    }
    
    console.log('Orders data extracted:', ordersData);
    
    // Lọc bỏ các đơn hàng đã giao
    const activeOrders = ordersData.filter(order => order && order.status !== 'Đã giao');
    
    setOrders(activeOrders);
    setFilteredOrders(activeOrders);
    console.log('Fetched active orders at management:', activeOrders);
    setError(null);
    } catch (error) {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = orders.filter(
      order => 
        order._id.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.paymentMethod.toLowerCase().includes(term) ||
        order.paymentStatus.toLowerCase().includes(term)
    );
    
    setFilteredOrders(filtered);
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setFormOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setFormOpen(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await orderApi.deleteOrder(id);
      showNotification('Xóa đơn hàng thành công', 'success');
      // Fetch lại dữ liệu từ API
      await fetchOrders();
    } catch (error) {
      showNotification('Xóa đơn hàng thất bại', 'error');
      console.error('Error deleting order:', error);
    }
  };

  const handleSaveOrder = async (orderData) => {
  try {
    console.log('Handling save order:', orderData);
    
    if (orderData._id) {
      // Update existing order
      const orderId = orderData._id;
      const { _id, ...updateData } = orderData;
      
      console.log('Updating order with ID:', orderId);
      console.log('Update data:', updateData);
      
      await orderApi.updateOrder(orderId, updateData);
      showNotification('Cập nhật đơn hàng thành công', 'success');
    } else {
      // Add new order
      console.log('Creating new order with data:', orderData);
      const response = await orderApi.createOrder(orderData);
      console.log('Create order response:', response);
      showNotification('Tạo đơn hàng thành công', 'success');
    }
    
    await fetchOrders();
  } catch (error) {
    console.error('Full error object:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    
    const isUpdate = orderData._id;
    const errorMessage = error.response?.data?.message || 
                        (isUpdate ? 'Cập nhật đơn hàng thất bại' : 'Tạo đơn hàng thất bại');
    showNotification(errorMessage, 'error');
  }
};

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
        <button className="btn btn-primary" onClick={handleAddOrder}>
          Tạo đơn hàng
        </button>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="content">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm kiếm đơn hàng (mã đơn, khách hàng, trạng thái...)..." 
        />
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <OrderList 
            orders={filteredOrders} 
            onEdit={handleEditOrder} 
            onDelete={handleDeleteOrder}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>
      
      <OrderForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        order={selectedOrder}
        onSave={handleSaveOrder}
      />

      <OrderDetails
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;