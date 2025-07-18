import { useState, useEffect } from 'react';

const ProductForm = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    teamName: '',
    category: '',
    type: '',
    size: '',
    quantity: 0,
    color: '',
    price: 0,
    importPrice: 0, // Thêm trường giá nhập
    images: [],
    season: '',
    homeOrAway: 'Home',
    adultOrKid: 'Adult',
    supplier: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = ['Áo', 'Quần', 'Phụ kiện'];
  const typeOptions = ['Ngắn', 'Dài', 'Thể thao', 'Casual'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const homeOrAwayOptions = ['Home', 'Away', 'Third'];
  const adultOrKidOptions = ['Adult', 'Kid'];
  const supplierOptions = ['Chú Phát', 'Tui bán áo bóng đá', 'Áo bóng đá TPHCM', 'Áo bóng đá Retro'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        teamName: product.teamName || '',
        category: product.category || '',
        type: product.type || '',
        size: product.size || '',
        quantity: product.quantity || 0,
        color: product.color || '',
        price: product.price || 0,
        importPrice: product.importPrice || 0, // Thêm giá nhập
        images: [], // reset ảnh khi sửa để người dùng chọn lại
        season: product.season || '',
        homeOrAway: product.homeOrAway || 'Home',
        adultOrKid: product.adultOrKid || 'Adult',
        supplier: product.supplier || '',
        description: product.description || ''
      });
    } else {
      setFormData({
        name: '',
        teamName: '',
        category: '',
        type: '',
        size: '',
        quantity: 0,
        color: '',
        price: 0,
        importPrice: 0, // Thêm giá nhập mặc định
        images: [],
        season: '',
        homeOrAway: 'Home',
        adultOrKid: 'Adult',
        supplier: '',
        description: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm không được để trống';
    if (!formData.teamName.trim()) newErrors.teamName = 'Tên đội không được để trống';
    if (!formData.category) newErrors.category = 'Vui lòng chọn danh mục';
    if (!formData.type) newErrors.type = 'Vui lòng chọn loại';
    if (!formData.size) newErrors.size = 'Vui lòng chọn kích thước';
    if (formData.quantity < 0) newErrors.quantity = 'Số lượng không được âm';
    if (formData.price <= 0) newErrors.price = 'Giá bán phải lớn hơn 0';
    if (formData.importPrice < 0) newErrors.importPrice = 'Giá nhập không được âm'; // Validate giá nhập
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    
    // Add text fields
    data.append('name', formData.name);
    data.append('teamName', formData.teamName);
    data.append('category', formData.category);
    data.append('type', formData.type);
    data.append('size', formData.size);
    data.append('quantity', formData.quantity.toString());
    data.append('color', formData.color);
    data.append('price', formData.price.toString());
    data.append('importPrice', formData.importPrice.toString()); // Thêm giá nhập
    data.append('season', formData.season);
    data.append('homeOrAway', formData.homeOrAway);
    data.append('adultOrKid', formData.adultOrKid);
    data.append('supplier', formData.supplier);
    data.append('description', formData.description);

    // Handle images - only append if there are actual files
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        if (file instanceof File) {
          console.log('Appending image file:', file.name, file.type, file.size);
          data.append('images', file);
        }
      });
    }

    // Add product ID for updates
    if (product?._id) {
      data.append('id', product._id);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of data.entries()) {
      if (value instanceof File) {
        console.log(key, 'File:', value.name, value.type, value.size);
      } else {
        console.log(key, value);
      }
    }

    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  // Tính toán profit margin
  const calculateProfitMargin = () => {
    const importPrice = parseFloat(formData.importPrice) || 0;
    const sellPrice = parseFloat(formData.price) || 0;
    
    if (importPrice <= 0 || sellPrice <= 0) return 0;
    
    return ((sellPrice - importPrice) / sellPrice * 100).toFixed(1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{product ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Thông tin cơ bản</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Tên sản phẩm *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Ví dụ: Áo Manchester United"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="teamName">Tên đội *</label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className={errors.teamName ? 'error' : ''}
                  placeholder="Ví dụ: Manchester United"
                />
                {errors.teamName && <span className="error-message">{errors.teamName}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Danh mục *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Chọn danh mục</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={errors.type ? 'error' : ''}
                >
                  <option value="">Chọn loại</option>
                  {typeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="form-section">
            <h3 className="section-title">Thông số sản phẩm</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="size">Kích thước *</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className={errors.size ? 'error' : ''}
                >
                  <option value="">Chọn size</option>
                  {sizeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.size && <span className="error-message">{errors.size}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="color">Màu sắc</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ví dụ: Đỏ, Xanh, Trắng..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="homeOrAway">Loại áo</label>
                <select
                  id="homeOrAway"
                  name="homeOrAway"
                  value={formData.homeOrAway}
                  onChange={handleChange}
                >
                  {homeOrAwayOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'Home' ? 'Sân nhà' : option === 'Away' ? 'Sân khách' : 'Thứ ba'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="adultOrKid">Đối tượng</label>
                <select
                  id="adultOrKid"
                  name="adultOrKid"
                  value={formData.adultOrKid}
                  onChange={handleChange}
                >
                  {adultOrKidOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'Adult' ? 'Người lớn' : 'Trẻ em'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="season">Mùa</label>
                <input
                  type="text"
                  id="season"
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  placeholder='Nhập mùa...'
                />
              </div>

              <div className="form-group">
                <label htmlFor="supplier">Nhà cung cấp</label>
                <select
                  id="supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                >
                  <option value=''>Chọn nhà cung cấp</option>
                  {supplierOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="form-section">
            <h3 className="section-title">Kho & Giá cả</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Số lượng *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <span className="error-message">{errors.quantity}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="importPrice">Giá nhập ($) *</label>
                <input
                  type="number"
                  id="importPrice"
                  name="importPrice"
                  value={formData.importPrice}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={errors.importPrice ? 'error' : ''}
                  placeholder="Giá nhập từ nhà cung cấp"
                />
                {errors.importPrice && <span className="error-message">{errors.importPrice}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Giá bán ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className={errors.price ? 'error' : ''}
                  placeholder="Giá bán cho khách hàng"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label>Tỷ suất lợi nhuận</label>
                <div className="profit-display">
                  {calculateProfitMargin()}%
                  {formData.importPrice > 0 && formData.price > 0 && (
                    <small className="profit-note">
                      Lợi nhuận: {new Intl.NumberFormat('vi-VN').format(formData.price - formData.importPrice)} $
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3 className="section-title">Hình ảnh</h3>
            
            <div className="form-group">
              <label>Hình ảnh sản phẩm</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                key={`${product?._id || 'new'}-${isOpen}`}
              />
              {formData.images.length > 0 && (
                <div className="image-list">
                  {formData.images.map((file, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Ảnh ${index + 1}`}
                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="remove-image-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <small className="form-help">
                {product ? 'Chọn ảnh mới để thay thế ảnh hiện tại (nếu có)' : 'Chọn một hoặc nhiều ảnh sản phẩm'}
              </small>
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h3 className="section-title">Mô tả</h3>
            
            <div className="form-group">
              <label htmlFor="description">Mô tả chi tiết</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Cập nhật' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
