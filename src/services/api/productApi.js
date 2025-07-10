import api from '../../constants/api.js';

const productApi = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      console.log('Fetched products:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      // For FormData, we need to remove the default Content-Type header
      const config = {
        headers: {
          "Content-Type": 'multipart/form-data' // Ensure this is set for FormData
        }
      };
      
      console.log('Creating product with FormData...');
      const response = await api.post('/products', productData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      // For FormData, we need to remove the default Content-Type header
      const config = {
        headers: {
          "Content-Type": 'multipart/form-data' // Ensure this is set for FormData
        }
      };
      
      console.log(`Updating product ${id} with FormData...`);
      const response = await api.put(`/products/${id}`, productData, config);
      console.log('Updated product:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }
};

export default productApi;