import React from 'react';
import { useSelector } from 'react-redux';
import { FaBell, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { user } = useSelector(state => state.user)

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
                        if (!user) navigate('/login')
                        else navigate(`/setting`)
                    }}
                >
                    <div className="icon">
                        <FaUser />
                    </div>
                    <div className="label">{user ? user.userName : 'Đăng nhập'}</div>
                </div>
            </div>
        </div>
    );
}

export default Header;
