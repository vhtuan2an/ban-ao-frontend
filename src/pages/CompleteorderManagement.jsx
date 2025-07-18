import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import OrderList from '../components/orders/OrderList';
import OrderDetails from '../components/orders/OrderDetails';
import orderApi from '../services/api/orderApi';

const CompletedOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      console.log('Completed orders API response:', response);
      
      // Xử lý cấu trúc dữ liệu
      let ordersArray = [];
      
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          ordersArray = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          ordersArray = response.data.data;
        }
      } else if (Array.isArray(response)) {
        ordersArray = response;
      }
      
      // Đảm bảo ordersArray là mảng và lọc chỉ lấy đơn hàng đã giao
      const safeOrdersArray = Array.isArray(ordersArray) ? ordersArray : [];
      const completedOrders = safeOrdersArray.filter(order => 
        order && typeof order === 'object' && order.status === 'Đã giao'
      );
      
      setOrders(completedOrders);
      setFilteredOrders(completedOrders);
      setError(null);
      console.log('Fetched completed orders:', completedOrders);
    } catch (error) {
      setError('Không thể tải danh sách đơn hàng đã giao. Vui lòng thử lại sau.');
      console.error('Error fetching completed orders:', error);
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
        order.paymentMethod.toLowerCase().includes(term) ||
        order.paymentStatus.toLowerCase().includes(term)
    );
    
    setFilteredOrders(filtered);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await orderApi.deleteOrder(id);
      showNotification('Xóa đơn hàng thành công', 'success');
      await fetchCompletedOrders();
    } catch (error) {
      showNotification('Xóa đơn hàng thất bại', 'error');
      console.error('Error deleting order:', error);
    }
  };

  const handleEditOrder = () => {
    showNotification('Không thể sửa đơn hàng đã giao', 'warning');
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
    <div className="completed-order-management">
      <div className="page-header">
        <h1>Đơn hàng đã giao</h1>
        <div className="order-stats">
          <span className="stat-badge">
            Tổng: {filteredOrders.length} đơn hàng
          </span>
          <span className="stat-badge total-revenue">
            Doanh thu: {new Intl.NumberFormat('vi-VN').format(
              filteredOrders.reduce((total, order) => total + (order.totalAmount || 0), 0)
            )} $
          </span>
        </div>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="content">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm kiếm đơn hàng đã giao (mã đơn, khách hàng...)..." 
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
            isReadOnly={true}
          />
        )}
      </div>

      <OrderDetails
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default CompletedOrderManagement;