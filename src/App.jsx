import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CustomerManagement from './pages/CustomerManagement';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import './assets/css/main.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-wrapper">
          <header className="app-header">
            <div className="header-content">
              <h1>Hệ thống quản lý bán áo đá banh</h1>
            </div>
          </header>
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="home">
                  <h1>Chào mừng đến với hệ thống quản lý bán áo đá banh</h1>
                  <p>Chọn một chức năng từ menu bên trái để bắt đầu</p>
                </div>
              } />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/reports" element={
                <div className="coming-soon">
                  <h2>Báo cáo thống kê</h2>
                  <p>Chức năng đang phát triển...</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="coming-soon">
                  <h2>Cài đặt hệ thống</h2>
                  <p>Chức năng đang phát triển...</p>
                </div>
              } />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <p>© 2025 Hệ thống quản lý bán áo đá banh cho Duy Quách</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/customers', label: 'Quản lý khách hàng', icon: '👥' },
    { path: '/products', label: 'Quản lý sản phẩm', icon: '👕' },
    { path: '/orders', label: 'Quản lý đơn hàng', icon: '📦' },
    { path: '/reports', label: 'Báo cáo thống kê', icon: '📊' },
    { path: '/settings', label: 'Cài đặt hệ thống', icon: '⚙️' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">Football Store</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <span className="user-icon">👤</span>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </div>
  );
}

export default App;