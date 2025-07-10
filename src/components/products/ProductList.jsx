import { useState } from 'react';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, product: null });

  const handleDeleteClick = (product) => {
    setDeleteConfirm({ show: true, product });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.product._id);
    setDeleteConfirm({ show: false, product: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, product: null });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' $';
  };

  return (
    <>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Đội bóng</th>
              <th>Loại</th>
              <th>Kích thước</th>
              <th>Màu sắc</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                      ) : (
                        <div className="no-image">Không có ảnh</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-category">{product.category}</div>
                    </div>
                  </td>
                  <td>{product.teamName}</td>
                  <td>{product.type}</td>
                  <td>
                    <span className="size-badge">{product.size}</span>
                  </td>
                  <td>
                    <div className="color-info">
                      {product.color && (
                        <div className="color-display">
                          <span className="color-text">{product.color}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`quantity-badge ${product.quantity <= 5 ? 'low-stock' : ''}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="price-cell">{formatPrice(product.price)}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => onEdit(product)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteClick(product)}
                        title="Xóa"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  Không có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{deleteConfirm.product?.name}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleDeleteCancel}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;