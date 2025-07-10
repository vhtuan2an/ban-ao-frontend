import api from '../../constants/api.js';

const orderApi = {
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      console.log('Fetched orders:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      await api.delete(`/orders/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
    }
  }
};

export default orderApi;