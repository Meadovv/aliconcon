import { useEffect, useState } from 'react';
import { Layout, Menu as AntMenu, Avatar } from 'antd';
import CustomLayout from '../../components/Layout';
import {
    UserOutlined,
    ShopOutlined,
    InfoCircleOutlined,
    AppstoreOutlined,
    ContainerOutlined,
    OrderedListOutlined,
    SettingOutlined,
  } from '@ant-design/icons';
import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Categories from '../Category';
import Analyst from '../Analyst';
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

const { Sider, Content } = Layout;
const { SubMenu } = AntMenu;

const menus = [
  {
    label: 'My Shop',
    link: 'my-shop',
    icon: <ShopOutlined />,
    content: <Analyst />,
  },
  {
    label: 'My Information',
    link: 'my-information',
    icon: <InfoCircleOutlined />,
    content: <MyInformation />,
  },
  {
    label: 'Products',
    link: 'products',
    icon: <AppstoreOutlined />,
    content: <Products />,
  },
  {
    label: 'Categories',
    link: 'categories',
    icon: <ContainerOutlined />,
    content: <Categories />,
  },
  {
    label: 'Orders',
    link: 'orders',
    icon: <OrderedListOutlined />,
    content: <Orders />,
  },
  {
    label: 'Settings',
    link: 'settings',
    icon: <SettingOutlined />,
    content: <Settings />,
  },
];

function Menu() {
    const { user } = useSelector((state) => state.user);
    const [currentMenu, setCurrentMenu] = useState(menus[0]);
    const [collapsed, setCollapsed] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

useEffect(() => {
    const menuLink = searchParams.get('menu');
    if (menuLink) {
      setCurrentMenu(menus.find((item) => item.link === menuLink));
    } else {
      setCurrentMenu(menus[0]);
    }
}, []);

  const handleMenuClick = (menu) => {
    setCurrentMenu(menu);
    navigate(`/?menu=${menu.link}`);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

return (
    <CustomLayout>
        <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
            <div className="avatar-field">
                <Avatar size={50} icon={<UserOutlined />} />
                {!collapsed && (
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>
                            {user?.shopName}
                        </div>
                        <div style={{ fontSize: '14px', color: '#fff', marginTop: '2px' }}>{user?.userName}</div>
                    </div>
                )}    
            </div>
            <AntMenu
                theme="dark"
                mode="inline"
                selectedKeys={[currentMenu.link]}
                defaultOpenKeys={['sub1']}
                inlineCollapsed={collapsed}
            >
                {menus.map((menu) =>
                    menu.subMenus ? (
                        <SubMenu key={menu.link} title={menu.label} icon={menu.icon}>
                            {menu.subMenus.map((subMenu) => (
                                <AntMenu.Item key={subMenu.link} onClick={() => handleMenuClick(subMenu)}>
                                    {subMenu.label}
                                </AntMenu.Item>
                            ))}
                        </SubMenu>
                    ) : (
                        <AntMenu.Item key={menu.link} icon={menu.icon} onClick={() => handleMenuClick(menu)}>
                            {menu.label}
                        </AntMenu.Item>
                    )
                )}
            </AntMenu>
        </Sider>
        <Content style={{ marginLeft: collapsed ? 80 : 200, padding: '20px' }}>
            {currentMenu.content}
        </Content>
    </CustomLayout>
  );
}

export default Menu;