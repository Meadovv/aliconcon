import React from 'react';
import "./index.scss";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

import { increaseQuantity, decreaseQuantity } from '../../reducer/actions/cart.slice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemCount, carts, total } = useSelector((state) => state.cart);

  if(carts.length === 0){
    return (
      <div className='container my-5'>
        <div className='empty-cart flex justify-center align-center flex-column font-manrope'>
          <img src ='/images/shopping_cart.png' alt = "" />
          <span className='fw-6 fs-15 text-gray'>Your shopping cart is empty.</span>
          <div onClick={() => navigate('/')} className='shopping-btn bg-orange text-white fw-5'>Go shopping Now</div>
        </div>
      </div>
    )
  }

  return (
    <div className='cart bg-whitesmoke'>
      <div className='container'>
        <div className='cart-ctable'>
          <div className='cart-chead bg-white'>
            <div className='cart-ctr fw-6 font-manrope fs-15'>
              <div className='cart-cth'>
                <span className='cart-ctxt'>S.N.</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Product</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Unit Price</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Quantity</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Total Price</span>
              </div>
              <div className='cart-cth'>
                <span className='cart-ctxt'>Actions</span>
              </div>
            </div>
          </div>

          <div className='cart-cbody bg-white'>
            {
              carts.map((cart, idx) => {
                return (
                  <div className='cart-ctr py-4' key = {idx}>
                    <div className='cart-ctd'>
                      <span className='cart-ctxt'>{idx + 1}</span>
                    </div>
                    <div className='cart-ctd' style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <span className='cart-ctxt fw-5'>{cart?.product.name}</span>
                      <span className='cart-ctxt' style={{
                        fontStyle: 'italic',
                      }}>{cart?.variation.name}</span>
                    </div>
                    <div className='cart-ctd'>
                      <span className='cart-ctxt'>{formatPrice(cart?.variation.price)}</span>
                    </div>
                    <div className='cart-ctd'>
                      <div className='qty-change flex align-center'>
                        <button type = "button" className='qty-decrease flex align-center justify-center' onClick={() => dispatch(decreaseQuantity({ itemIdx: idx }))}>
                          <i className='fas fa-minus'></i>
                        </button>

                        <div className='qty-value flex align-center justify-center'>
                          {cart?.quantity}
                        </div>

                        <button type = "button" className='qty-increase flex align-center justify-center' onClick={() => dispatch(increaseQuantity({ itemIdx: idx }))}>
                          <i className='fas fa-plus'></i>
                        </button>
                      </div>
                    </div>

                    <div className='cart-ctd'>
                      <span className='cart-ctxt text-orange fw-5'>{formatPrice(cart?.variation.price * cart?.quantity)}</span>
                    </div>

                    <div className='cart-ctd'>
                      <button type = "button" className='delete-btn text-dark' onClick={() => dispatch()}>Delete</button>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className='cart-cfoot flex align-start justify-between py-3 bg-white'>
            <div className='cart-cfoot-l'>
              <button type='button' className='clear-cart-btn text-danger fs-15 text-uppercase fw-4' onClick={() => dispatch(clearCart())}>
                <i className='fas fa-trash'></i>
                <span className='mx-1'>Clear Cart</span>
              </button>
            </div>

            <div className='cart-cfoot-r flex flex-column justify-end'>
              <div className='total-txt flex align-center justify-end'>
                <div className='font-manrope fw-5'>Total {itemCount} items: </div>
                <span className='text-orange fs-22 mx-2 fw-6'>{formatPrice(total)}</span>
              </div>

              <button type = "button" className='checkout-btn text-white bg-orange fs-16'>Check Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage