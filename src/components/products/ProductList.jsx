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

  const getTypeLabel = (homeOrAway, adultOrKid) => {
    const typeMap = {
      'Home': 'Sân nhà',
      'Away': 'Sân khách', 
      'Third': 'Thứ ba'
    };
    
    const audienceMap = {
      'Adult': 'Người lớn',
      'Kid': 'Trẻ em'
    };

    return `${typeMap[homeOrAway] || homeOrAway} - ${audienceMap[adultOrKid] || adultOrKid}`;
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
              <th>Loại áo</th>
              <th>Kích thước</th>
              <th>Màu sắc</th>
              <th>Nhà cung cấp</th>
              <th>Số lượng</th>
              <th>Giá nhập</th>
              <th>Giá bán</th>
              <th>Lợi nhuận</th>
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
                      {product.season && (
                        <div className="product-season">{product.season}</div>
                      )}
                    </div>
                  </td>
                  <td>{product.teamName}</td>
                  <td>
                    <div className="product-type-info">
                      <div className="type-main">{getTypeLabel(product.homeOrAway, product.adultOrKid)}</div>
                      <div className="type-detail">{product.type}</div>
                    </div>
                  </td>
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
                    <div className="supplier-info">
                      {product.supplier || '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`quantity-badge ${product.quantity <= 5 ? 'low-stock' : ''}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="price-cell import-price">
                    {formatPrice(product.importPrice || 0)}
                  </td>
                  <td className="price-cell sell-price">
                    {formatPrice(product.price)}
                  </td>
                  <td className="price-cell profit-cell">
                    <div className="profit-info">
                      <div className="profit-amount">
                        {formatPrice((product.price || 0) - (product.importPrice || 0))}
                      </div>
                      <div className="profit-percentage">
                        {product.importPrice && product.price ? 
                          `${(((product.price - product.importPrice) / product.price) * 100).toFixed(1)}%` 
                          : '0%'
                        }
                      </div>
                    </div>
                  </td>
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
                <td colSpan="12" className="no-data">
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