import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SearchButton from '../SearchButton';
import { HeaderContainer, LogoContainer, SearchContainer, MenuContainer, MenuItem } from './style';
import { LoginModal } from '../LoginModal';
import { switchModal } from '../../reducer/actions/login.slice';
import { useNavigate } from 'react-router-dom';

function Header() {
    const { user } = useSelector((state) => state.user);
    const [openLoginModal, setOpenLoginModal] = React.useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSearch = (value) => {
        console.log(value);
    };

    return (
        <>
            <LoginModal />
            <HeaderContainer>
                <LogoContainer onClick={() => navigate('/')}>Aliconcon</LogoContainer>

                <SearchContainer>
                    <SearchButton size="large" placeholder={'Bạn muốn tìm gì?'} onSearch={onSearch} />
                </SearchContainer>

                <MenuContainer>
                    <MenuItem>Thông báo</MenuItem>
                    <MenuItem>Giỏ hàng</MenuItem>
                    <MenuItem onClick={() => {
                        if(user._id && user._id !== -1) navigate('/setting');
                        else dispatch(switchModal());
                    }}>{user._id && user._id !== -1 ? user.name : 'Đăng nhập'}</MenuItem>
                </MenuContainer>
            </HeaderContainer>
        </>
    );
}

export default Header;
