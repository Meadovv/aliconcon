import React, {useEffect, useState} from 'react';
import "./index.scss";
import { useNavigate } from "react-router-dom";
import CartModal from "../../Modal/Cart";
import { useSelector } from 'react-redux';
import { message } from 'antd';

const Navbar = () => {

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {

  }, [])

  return (
    <nav className='navbar'>
      <div className='navbar-cnt flex align-center'>
        <div className='brand-and-toggler flex align-center'>
          <div className='navbar-brand flex align-center' onClick={() => navigate('/')} style={{
            cursor: 'pointer'
          }}>
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
              <div className='text-white search-btn flex align-center justify-center' onClick={() => {
                if(!searchTerm) {
                  return message.error('Please enter a search value');
                }
                navigate(`/search?key=${searchTerm}`)
              }} style={{
                cursor: 'pointer'
              }}>
                  <i className='fa-solid fa-magnifying-glass'></i>
                </div>
            </div>
          </div>
        </div>

        <div className='navbar-cart flex align-center'>
          <div className='cart-btn' onClick={() => navigate('/cart')}>
            <i className='fa-solid fa-cart-shopping'></i>
            <div className='cart-items-value' style={{
              display: cart.itemCount ? 'flex' : 'none'
            }}>{cart.itemCount}</div>
            <CartModal carts = {cart.carts} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar