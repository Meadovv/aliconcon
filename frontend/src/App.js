// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
          <Route path="/products" Component = {ProductList} > c</Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
