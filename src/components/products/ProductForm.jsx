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
    images: [],
    season: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const categoryOptions = ['Áo', 'Quần', 'Phụ kiện'];
  const typeOptions = ['Ngắn', 'Dài', 'Thể thao', 'Casual'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const seasonOptions = ['Mùa hè', 'Mùa đông', 'Cả năm'];

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
        images: [], // reset ảnh khi sửa để người dùng chọn lại
        season: product.season || '',
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
        images: [],
        season: '',
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
    console.log('Selected files:', files); // Debug log
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
    if (formData.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
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
    data.append('season', formData.season);
    data.append('description', formData.description);

    // Handle images - only append if there are actual files
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => {
        if (file instanceof File) {
          console.log('Appending image file:', file.name, file.type, file.size); // Debug log
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

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>{product ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
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
                placeholder="Ví dụ: Xanh, Đỏ, Trắng..."
              />
            </div>
          </div>

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
              <label htmlFor="price">Giá ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="season">Mùa</label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleChange}
            >
              <option value="">Chọn mùa</option>
              {seasonOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Hình ảnh (từ thiết bị)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              key={`${product?._id || 'new'}-${isOpen}`} // Reset file input when form opens
            />
            {formData.images.length > 0 && (
              <div className="image-list">
                {formData.images.map((file, index) => (
                  <div key={index} className="image-item">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`Ảnh ${index + 1}`}
                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))} // Clean up object URL
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

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
