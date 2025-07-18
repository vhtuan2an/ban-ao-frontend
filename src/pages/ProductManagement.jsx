import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import SearchBar from '../components/SearchBar';
import productApi from '../services/api/productApi';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      
      setProducts(data.data);
      setFilteredProducts(data.data);
      console.log('Fetched products at management:', data);
      setError(null);
    } catch (error) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = products.filter(
      product => 
        product.name.toLowerCase().includes(term) ||
        product.teamName.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.type.toLowerCase().includes(term) ||
        product.size.toLowerCase().includes(term) ||
        product.color.toLowerCase().includes(term) ||
        product.homeOrAway.toLowerCase().includes(term) ||
        product.adultOrKid.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term) ||
        product.season.toLowerCase().includes(term)
    );
    
    setFilteredProducts(filtered);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productApi.deleteProduct(id);
      showNotification('Xóa sản phẩm thành công', 'success');
      // Fetch lại dữ liệu từ API
      await fetchProducts();
    } catch (error) {
      showNotification('Xóa sản phẩm thất bại', 'error');
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      // Debug: Log the data being sent
      console.log('Saving product data:', productData);
      
      if (productData.get('id')) {
        // Update existing product - use the ID from FormData
        const productId = productData.get('id');
        await productApi.updateProduct(productId, productData);
        showNotification('Cập nhật sản phẩm thành công', 'success');
      } else {
        // Add new product
        await productApi.createProduct(productData);
        showNotification('Thêm sản phẩm thành công', 'success');
      }
      // Fetch lại dữ liệu từ API sau khi thêm/sửa thành công
      await fetchProducts();
    } catch (error) {
      // Enhanced error logging
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      const errorMessage = error.response?.data?.message || 
                          (productData.get('id') ? 'Cập nhật sản phẩm thất bại' : 'Thêm sản phẩm thất bại');
      showNotification(errorMessage, 'error');
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
    <div className="product-management">
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Thêm sản phẩm
        </button>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="content">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm kiếm sản phẩm (tên, đội, loại, kích thước...)..." 
        />
        
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <ProductList 
            products={filteredProducts} 
            onEdit={handleEditProduct} 
            onDelete={handleDeleteProduct} 
          />
        )}
      </div>
      
      <ProductForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default ProductManagement;