import React from 'react';
import './index.scss';
import { formatPrice } from '../../../utils/helpers';

import { IMAGE_HOST } from '../../../apis';

const CartModal = ({ carts }) => {
    return (
        <div className="cart-modal">
            <h5 className="cart-modal-title fw-5 fs-15 font-manrope text-center">Recently Added Products</h5>
            {carts?.length > 0 ? (
                <div className="cart-modal-list grid">
                    {carts.map((item, index) => {
                        const newPrice = item?.price - (item?.price * item?.sale) / 100;
                        return (
                            <div className="cart-modal-item grid align-center font-manrope py-2" key={index}>
                                <div className="cart-modal-item-img">
                                    <img src={IMAGE_HOST.THUMBNAIL(item?.thumbnail.name)} alt="" className="img-cover" />
                                </div>
                                <div>
                                    <div className="cart-modal-item-title fs-13 font-manrope text-capitalize">
                                        {item?.name}
                                    </div>
                                    <div className="cart-modal-item-price text-orange fs-14 fw-6">
                                        {formatPrice(newPrice)} <div className='text-black'>x {item?.quantity}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="text-capitalize view-cart-btn bg-orange fs-15 font-manrope text-center">
                        view my shopping cart
                    </div>
                </div>
            ) : (
                <div className="flex flex-column align-center justify-center cart-modal-empty">
                    <img src="/images/shopping_cart.png" alt="" className="" />
                    <h6 className="text-dark fw-4">No products yet</h6>
                </div>
            )}
        </div>
    );
};

export default CartModal;
