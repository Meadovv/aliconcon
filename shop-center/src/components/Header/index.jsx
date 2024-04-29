import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaBell, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { selectShop, setAuth } from '../../reducer/actions/auth.slice';

function Header() {

    const shop = useSelector(selectShop);

    const navigate = useNavigate();
    
    return (
        <div className="header global-container">
            <div className="logo" onClick={() => navigate('/')}>
                <img src="/images/logo.png" alt="logo" />
                <div className="shop-name">Aliconcon Shop Center</div>
            </div>

            <div className="user-info">
                <div className="item">
                    <div className="icon">
                        <FaInfoCircle />
                    </div>
                    <div className="label">Hỗ trợ</div>
                </div>
                <div className="item">
                    <div className="icon">
                        <FaBell />
                    </div>
                    <div className="label">Thông báo</div>
                </div>
                <div
                    className="item"
                    onClick={() => {
                        if (!shop) navigate('/login')
                        else navigate(`/setting`)
                    }}
                >
                    <div className="icon">
                        <FaUser />
                    </div>
                    <div className="label">{shop ? shop.name : 'Đăng nhập'}</div>
                </div>
            </div>
        </div>
    );
}

export default Header;
