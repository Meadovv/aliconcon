// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';
import Cart from './Cart';
import Purchase from './Purchase'; // Assuming you have a Purchase component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const handleLogin = () => {
    // Simulate login process
    if (username === 'demo' && password === 'demo') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const addToCart = (product) => {
    if (!isLoggedIn) {
      alert('You must log in first');
      return;
    }
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>My - Ecommerce</h1>
          {isLoggedIn ? (
            <>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/cart">Cart</Link>
            </>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
            </div>
          )}
        </header>
        <Header/>
        <main>
          <Routes>
            <Route path="/products" element={<ProductList addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />} />
            <Route path="/purchase" element={<Purchase username={username} cartItems={cartItems} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
