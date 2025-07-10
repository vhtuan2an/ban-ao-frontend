import { useState } from 'react';

const CustomerList = ({ customers, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, customer: null });

  const handleDeleteClick = (customer) => {
    setDeleteConfirm({ show: true, customer });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirm.customer._id);
    setDeleteConfirm({ show: false, customer: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ show: false, customer: null });
  };

  return (
    <>
      <div className="customer-table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>{customer.notes}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => onEdit(customer)}
                        title="Sửa"
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteClick(customer)}
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
                <td colSpan="5" className="no-data">
                  Không có khách hàng nào
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
              <p>Bạn có chắc chắn muốn xóa khách hàng <strong>{deleteConfirm.customer?.name}</strong>?</p>
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

export default CustomerList;