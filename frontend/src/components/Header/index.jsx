import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBell, FaUser, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import Authentication from '../Authentication';

function Header() {
    const { user } = useSelector(state => state.user)

    const [openAuthenticationModal, setOpenAuthenticationModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="header global-container">
            <Authentication openModal={openAuthenticationModal} setOpenModal={setOpenAuthenticationModal} />
            <div className="logo" onClick={() => navigate('/')}>
                <img src="/images/logo.png" alt="logo" />
                <div className="shop-name">Aliconcon</div>
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
                        if (!user) setOpenAuthenticationModal(true);
                        else navigate(`/setting`)
                    }}
                >
                    <div className="icon">
                        <FaUser />
                    </div>
                    <div className="label">{user ? user.name : 'Đăng nhập'}</div>
                </div>
            </div>
        </div>
    );
}

export default Header;
