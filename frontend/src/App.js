import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchData();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(API_URL + '/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'error', elasticsearch: false });
    }
  };

  const fetchData = async () => {
    try {
      const usersRes = await fetch(API_URL + '/users');
      const productsRes = await fetch(API_URL + '/products');
      const ordersRes = await fetch(API_URL + '/orders');
      
      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const endpoint = activeTab === 'users' ? 'users' : 'products';
      const res = await fetch(API_URL + '/' + endpoint + '/search/?q=' + searchQuery);
      const data = await res.json();
      setSearchResults(data[endpoint] || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const renderTable = (data, type) => {
    if (data.length === 0) return <p>No data found</p>;

    if (type === 'users') {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {data.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === 'products') {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (type === 'orders') {
      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>{order.product_id}</td>
                <td>{order.quantity}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="App">
      <header>
        <h1>SyncFlow Dashboard</h1>
        <div className={health?.status === 'healthy' ? 'health-status healthy' : 'health-status error'}>
          Status: {health?.status || 'checking...'} | 
          Elasticsearch: {health?.elasticsearch ? 'Working' : 'WorkingNOT'}
        </div>
      </header>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => { setSearchResults([]); setSearchQuery(''); }}>Clear</button>
        <button onClick={fetchData}>Refresh Data</button>
      </div>

      <div className="tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      <div className="content">
        {searchResults.length > 0 ? (
          <div>
            <h2>Search Results</h2>
            {renderTable(searchResults, activeTab)}
          </div>
        ) : (
          <div>
            {activeTab === 'users' && renderTable(users, 'users')}
            {activeTab === 'products' && renderTable(products, 'products')}
            {activeTab === 'orders' && renderTable(orders, 'orders')}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;