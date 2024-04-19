import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Categories from '../Category';
import MyShop from '../MyShop';
import Products from '../Products/Products';
import Orders from '../Orders';
import Settings from '../Setting';

function MyInformation() {
    const { user } = useSelector((state) => state.user);
    const role = (role) => {
        switch (role) {
            case 0:
                return 'OWNER';
            case 1:
                return 'ADMIN';
            case 2:
                return 'MOD';
            default:
                return 'UNDEFINED';
        }
    };
    return (
        <div>
            <div>Name: {user.userName}</div>
            <div>Role: {role(user.role)}</div>
        </div>
    );
}

const menus = [
    {
        label: 'My Shop',
        link: 'my-shop',
        content: <MyShop />,
    },
    {
        label: 'My Information',
        link: 'my-information',
        content: <MyInformation />,
    },
    {
        label: 'Products',
        link: 'products',
        content: <Products />,
    },
    {
        label: 'Categories',
        link: 'categories',
        content: <Categories />,
    },
    {
        label: 'Orders',
        link: 'orders',
        content: <Orders />,
    },
    {
        label: 'Settings',
        link: 'settings',
        content: <Settings />,
    },
];

function Menu() {
    const { user } = useSelector((state) => state.user);
    const [currentMenu, setCurrentMenu] = useState(menus[0]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const menuLink = searchParams.get('menu');
        if (menuLink) {
            setCurrentMenu(menus.filter((item) => item.link === menuLink)[0]);
        } else {
            setCurrentMenu(menus[0]);
        }
    }, []);

    useEffect(() => {
        navigate(`/setting?menu=${currentMenu.link}`);
    }, [currentMenu]);

    return (
        <Layout>
            <div className="global-container profile-container">
                <div className="left-side">
                    <div
                        className="avatar-field"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Avatar size={100} icon={<UserOutlined />} />
                        <div
                            style={{
                                marginLeft: '10px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexWrap: 'wrap',
                            }}
                        >
                            {user?.shopName}
                        </div>
                        <div
                            style={{
                                marginLeft: '10px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexWrap: 'wrap',
                                color: 'gray',
                            }}
                        >
                            {user?.userName}
                        </div>
                    </div>
                    <div className="menu">
                        {menus &&
                            menus.map((item) => {
                                return (
                                    <div
                                        className="menu-item"
                                        key={item.link}
                                        style={{
                                            color: item.link === currentMenu.link ? 'var(--primary-color)' : 'black',
                                        }}
                                        onClick={() =>
                                            setCurrentMenu(menus.filter((menu) => menu.link === item.link)[0])
                                        }
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div className="right-side">{currentMenu.content}</div>
            </div>
        </Layout>
    );
}

export default Menu;
