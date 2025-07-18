// import { useState } from 'react';

const OrderDetails = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' $';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h2>Chi tiết đơn hàng #{order._id.slice(-6).toUpperCase()}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-details">
            {/* Order Info */}
            <div className="order-info-section">
              <h3>Thông tin đơn hàng</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value">#{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Ngày đặt:</span>
                  <span className="value">{formatDate(order.orderDate)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Trạng thái:</span>
                  <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                    {order.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Thanh toán:</span>
                  <span className={`payment-badge payment-${order.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Phương thức:</span>
                  <span className="value">{order.paymentMethod}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tổng tiền:</span>
                  <span className="value price-highlight">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="customer-info-section">
              <h3>Thông tin khách hàng</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Tên:</span>
                  <span className="value">{order.customer?.name || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Điện thoại:</span>
                  <span className="value">{order.customer?.phone || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Địa chỉ:</span>
                  <span className="value">{order.customer?.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h3>Sản phẩm đặt hàng</h3>
              <div className="items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Đội</th>
                      <th>Size</th>
                      <th>Tên in</th>
                      <th>Số áo</th>
                      <th>Loại áo</th>
                      <th>Kích cỡ</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.product?.name || 'Product'} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          ) : (
                            <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                              No Image
                            </div>
                          )}
                        </td>
                        <td>{item.product?.name || 'N/A'}</td>
                        <td>{item.teamName}</td>
                        <td><span className="size-badge">{item.size}</span></td>
                        <td>{item.printName || '-'}</td>
                        <td>{item.printNumber || '-'}</td>
                        <td>{item.homeOrAway || '-'}</td>
                        <td>{item.adultOrKid || '-'}</td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.price)}</td>
                        <td className="price-cell">{formatPrice(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="10"><strong>Tổng cộng:</strong></td>
                      <td className="price-cell"><strong>{formatPrice(order.totalAmount)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="notes-section">
                <h3>Ghi chú</h3>
                <p className="notes-content">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;