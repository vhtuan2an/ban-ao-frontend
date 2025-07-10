import { useState, useEffect } from 'react';
import CustomerList from '../components/customers/CustomerList';
import CustomerForm from '../components/customers/CustomerForm';
import SearchBar from '../components/SearchBar';
import customerApi from '../services/api/customerApi';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerApi.getAllCustomers();
      
      setCustomers(data.data);
      setFilteredCustomers(data.data);
      console.log('Fetched customers at management:', data);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách khách hàng. Vui lòng thử lại sau.');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.address.toLowerCase().includes(term)
    );
    
    setFilteredCustomers(filtered);
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await customerApi.deleteCustomer(id);
      showNotification('Xóa khách hàng thành công', 'success');
      // Fetch lại dữ liệu từ API
      await fetchCustomers();
    } catch (error) {
      showNotification('Xóa khách hàng thất bại', 'error');
      console.error('Error deleting customer:', error);
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (customerData.id) {
        // Update existing customer
        await customerApi.updateCustomer(customerData.id, customerData);
        showNotification('Cập nhật khách hàng thành công', 'success');
      } else {
        // Add new customer
        await customerApi.createCustomer(customerData);
        showNotification('Thêm khách hàng thành công', 'success');
      }
      // Fetch lại dữ liệu từ API sau khi thêm/sửa thành công
      await fetchCustomers();
    } catch (error) {
      showNotification(
        customerData.id ? 'Cập nhật khách hàng thất bại' : 'Thêm khách hàng thất bại', 
        'error'
      );
      console.error('Error saving customer:', error);
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
    <div className="customer-management">
      <div className="page-header">
        <h1>Quản lý khách hàng</h1>
        <button className="btn btn-primary" onClick={handleAddCustomer}>
          Thêm khách hàng
        </button>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="content">
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <CustomerList 
            customers={filteredCustomers} 
            onEdit={handleEditCustomer} 
            onDelete={handleDeleteCustomer} 
          />
        )}
      </div>
      
      <CustomerForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default CustomerManagement;