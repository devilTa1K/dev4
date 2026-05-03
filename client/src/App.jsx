import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// API Configuration
const API_URL = 'http://localhost:5003/api';
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Components
const Navbar = ({ user, logout }) => (
  <nav className="navbar">
    <div className="container">
      <Link to="/" className="nav-brand">Nexus Shop</Link>
      <div className="nav-links">
        <Link to="/">Products</Link>
        {user ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <button onClick={logout} className="btn btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </div>
  </nav>
);

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_URL}/cart`, { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      if(err.response?.status === 401) alert('Please login first');
      else alert('Error adding to cart');
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Explore Products</h1>
      <div className="product-grid">
        {products.map(p => (
          <div key={p._id} className="product-card">
            <img src={p.imageUrl || 'https://via.placeholder.com/300'} alt={p.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{p.name}</h3>
              <p style={{color: 'var(--text-muted)', marginBottom: '10px'}}>{p.description}</p>
              <div className="product-price">${p.price}</div>
              <button onClick={() => addToCart(p._id)} className="btn btn-primary" style={{marginTop: 'auto'}}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      setAuth(res.data.user);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" onChange={e => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Login</button>
      </form>
    </div>
  );
};

const Register = ({ setAuth }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      localStorage.setItem('token', res.data.token);
      setAuth(res.data.user);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" className="form-control" onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" onChange={e => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Register</button>
      </form>
    </div>
  );
};

const Cart = () => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios.get(`${API_URL}/cart`).then(res => setCart(res.data)).catch(console.error);
  };

  const checkout = async () => {
    try {
      await axios.post(`${API_URL}/orders`);
      alert('Order placed successfully!');
      fetchCart();
    } catch (err) {
      alert('Checkout failed');
    }
  };

  if (!cart || !cart.products || cart.products.length === 0) {
    return <div className="container"><h1 className="page-title">Your Cart is Empty</h1></div>;
  }

  const total = cart.products.reduce((acc, curr) => acc + (curr.product?.price || 0) * curr.quantity, 0);

  return (
    <div className="container">
      <h1 className="page-title">Your Cart</h1>
      {cart.products.map((p, i) => p.product ? (
        <div key={i} className="cart-item">
          <div className="cart-item-info">
            <h3>{p.product.name}</h3>
            <span style={{color: 'var(--text-muted)'}}>x {p.quantity}</span>
          </div>
          <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>${p.product.price * p.quantity}</div>
        </div>
      ) : null)}
      <div style={{textAlign: 'right', marginTop: '30px'}}>
        <h2>Total: ${total}</h2>
        <button onClick={checkout} className="btn btn-primary" style={{marginTop: '20px', fontSize: '1.2rem', padding: '15px 40px'}}>Checkout</button>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/orders`).then(res => setOrders(res.data)).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Order History</h1>
      {orders.map(o => (
        <div key={o._id} className="order-item" style={{display: 'block'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <div>
              <h3>Order ID: {o._id.substring(0, 8)}...</h3>
              <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{new Date(o.createdAt).toLocaleString()}</div>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)'}}>${o.totalAmount}</div>
              <div style={{color: 'var(--success)'}}>{o.status}</div>
            </div>
          </div>
          <div style={{borderTop: '1px solid var(--border)', paddingTop: '15px'}}>
            {o.products.map((p, i) => p.product ? (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                <span>{p.product.name} x {p.quantity}</span>
                <span>${p.product.price * p.quantity}</span>
              </div>
            ) : null)}
          </div>
        </div>
      ))}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check auth on load by checking if token exists (simple version)
    if(localStorage.getItem('token')) {
      // Decode JWT in real app, here we just set placeholder
      setUser({ loggedIn: true });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setAuth={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register setAuth={setUser} />} />
        <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
