import api from '../../constants/api.js';

const customerApi = {
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      console.log('Fetched customers:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer with id ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
      await api.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }
};

export default customerApi;