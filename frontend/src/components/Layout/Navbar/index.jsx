import React, {useEffect, useState} from 'react';
import "./index.scss";
import { useNavigate } from "react-router-dom";
import CartModal from "../../Modal/Cart";
import { useSelector } from 'react-redux';

const Navbar = () => {

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart)

  const handleSearchTerm = (e) => {

  }

  useEffect(() => {

  }, [])

  return (
    <nav className='navbar'>
      <div className='navbar-cnt flex align-center'>
        <div className='brand-and-toggler flex align-center'>
          <button type = "button" className='sidebar-show-btn text-white'>
            <i className='fas fa-bars'></i>
          </button>
          <div className='navbar-brand flex align-center' onClick={() => navigate('/')}>
            <span className='navbar-brand-ico'>
              <i className='fa-solid fa-bag-shopping'></i>
            </span>
            <span className='navbar-brand-txt mx-2'>
              <span className='fw-7'>Aliconcon</span>
            </span>
          </div>
        </div>

        <div className='navbar-collapse w-100'>
          <div className='navbar-search bg-white'>
            <div className='flex align-center'>
              <input type = "text" className='form-control fs-14' placeholder='Search your preferred items here' onChange={(e) => handleSearchTerm(e)} />
              <div className='text-white search-btn flex align-center justify-center' onClick={() => navigate('/abc')}>
                  <i className='fa-solid fa-magnifying-glass'></i>
                </div>
            </div>
          </div>

          {/* <ul className='navbar-nav flex align-center fs-12 fw-4 font-manrope'>
            {
              // taking only first 8 categories
              categories.slice(0, 8).map((category, idx) => (
                <li className='nav-item no-wrap' key = {idx}>
                  <Link to = {`category/${category}`} className='nav-link text-capitalize'>{category.replace("-", " ")}</Link>
                </li>
              ))
            }
          </ul> */}
        </div>

        <div className='navbar-cart flex align-center'>
          <div className='cart-btn' onClick={() => navigate('/cart')}>
            <i className='fa-solid fa-cart-shopping'></i>
            <div className='cart-items-value' style={{
              display: cart.itemCount ? 'block' : 'none'
            }}>{cart.itemCount}</div>
            <CartModal carts = {cart.carts} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar