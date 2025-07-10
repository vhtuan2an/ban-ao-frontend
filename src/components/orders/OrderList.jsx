import { useState } from 'react';

const OrderList = ({ orders, onEdit, onDelete, onViewDetails }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, order: null });

  const handleDeleteClick = (order) => {
    setDeleteConfirm({ show: true, order });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.order._id);
    setDeleteConfirm({ show: false, order: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, order: null });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' $';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Đã tạo': 'status-created',
      'Đang xử lý': 'status-processing',
      'Đã xác nhận': 'status-confirmed',
      'Đang giao': 'status-shipping',
      'Đã giao': 'status-delivered',
      'Đã hủy': 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentClasses = {
      'Chưa thanh toán': 'payment-pending',
      'Đã thanh toán': 'payment-paid',
      'Hoàn tiền': 'payment-refunded'
    };

    return (
      <span className={`payment-badge ${paymentClasses[paymentStatus] || ''}`}>
        {paymentStatus}
      </span>
    );
  };

  return (
    <>
      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Phương thức</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="order-id">
                      #{order._id.slice(-6).toUpperCase()}
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        {order.customer?.name || 'N/A'}
                      </div>
                      <div className="customer-phone">
                        {order.customer?.phone || ''}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td className="price-cell">{formatPrice(order.totalAmount)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={() => onViewDetails(order)}
                        title="Xem chi tiết"
                      >
                        Xem
                      </button>
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => onEdit(order)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteClick(order)}
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
                <td colSpan="8" className="no-data">
                  Không có đơn hàng nào
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
              <p>Bạn có chắc chắn muốn xóa đơn hàng <strong>#{deleteConfirm.order?._id.slice(-6).toUpperCase()}</strong>?</p>
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

export default OrderList;