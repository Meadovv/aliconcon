import React from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector, useDispatch } from 'react-redux';

import { openModal } from '../../../reducer/actions/modal.slice';

import LoginModal from '../../Modal/Login';
import CheckoutModal from '../../Modal/Checkout';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    return (
        <>
            <LoginModal />
            <CheckoutModal />
            <header className="header text-white">
                <div className="container">
                    <div className="header-cnt">
                        <div className="header-cnt-top fs-13 py-2 flex align-center justify-between">
                            <div className="header-cnt-top-l">
                                <ul className="flex top-links align-center">
                                    <li>
                                        <p className="link" onClick={() => window.location.href = 'https://shop.aliconcon.xyz'}>
                                            Seller Center
                                        </p>
                                    </li>
                                    <li className="vert-line"></li>
                                    <li>
                                        <p className="link" onClick={() => navigate('/tracking')}>
                                            Tracking
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="header-cnt-top-r">
                                {user?.name ? (
                                    <p className="link" onClick={() => navigate('/setting')}>
                                        {user.name}
                                    </p>
                                ) : (
                                    <ul className="top-links flex align-center">
                                        <li>
                                            <p className="link" onClick={() => navigate('/authentication')}>
                                                Register
                                            </p>
                                        </li>
                                        <li className="vert-line"></li>
                                        <li>
                                            <p className="link" onClick={() => dispatch(openModal({ modal: 'login' }))}>
                                                Login
                                            </p>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="header-cnt-bottom">
                            <Navbar />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
