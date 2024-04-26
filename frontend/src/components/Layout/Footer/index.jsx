import React from 'react';
import "./index.scss";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='footer bg-orange'>
      <div className = "container py-4 text-center">
        <div className='flex align-center justify-center text-white fw-3 fs-14'>
          <p className='link'>privacy policy</p>
          <div className='vert-line'></div>
          <p className='link'>term of service</p>
          <div className='vert-line'></div>
          <p className='link'>about Aliconcon.</p>
        </div>
        <span className='text-white copyright-text text-manrope fs-14 fw-3'>&copy; 2024 Aliconcon. All Rights Reserved.</span>
      </div>
    </footer>
  )
}

export default Footer