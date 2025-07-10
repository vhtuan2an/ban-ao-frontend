import { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Tìm kiếm khách hàng..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        <div className="search-buttons">
          <button onClick={handleSearch} className="btn btn-primary">
            Tìm kiếm
          </button>
          {searchTerm && (
            <button onClick={handleClear} className="btn btn-secondary">
              Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;