import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

function MyAccount() {
    return <div>My Account</div>;
}

function MyPurchase() {
    return <div>My Purchase</div>;
}

function Notifications() {
    return <div>Notifications</div>;
}

function MyVouchers() {
    return <div>My Vouchers</div>;
}

function Settings() {

    const navigate = useNavigate();

    return (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
            <Popconfirm
                title="Logout"
                description="Are you sure to logout?"
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                    type: 'primary',
                    danger: true,
                    size: 'large',
                }}
                cancelButtonProps={{
                    size: 'large',
                    type: 'primary',
                }}
                onConfirm={() => navigate('/logout')}
            >
                <Button type="primary" danger size="large">
                    Logout
                </Button>
            </Popconfirm>
        </div>
    );
}

const menus = [
    {
        label: 'My Account',
        link: 'my-account',
        content: <MyAccount />,
    },
    {
        label: 'My Purchase',
        link: 'my-purchase',
        content: <MyPurchase />,
    },
    {
        label: 'Notifications',
        link: 'notifications',
        content: <Notifications />,
    },
    {
        label: 'My Vouchers',
        link: 'my-vouchers',
        content: <MyVouchers />,
    },
    {
        label: 'Settings',
        link: 'settings',
        content: <Settings />,
    },
];

function Profile() {
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
                    <div className="avatar-field">
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
                            {user?.name}
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

export default Profile;
