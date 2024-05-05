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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Categories from '../Category/Category';
import Analyst from '../Analyst';
import Products from '../Products/Products';
import Orders from '../Orders';
import Settings from '../Setting';
import { selectShop, setAuth } from '../../reducer/actions/auth.slice';
import UserSetting from '../UserSetting';

function MyInformation() {
    const shop = useSelector(selectShop);

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
            <div>Shop name: {shop.name}</div>
            <div>Role: {shop.role}</div>
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
    label: 'Shop User',
    link: 'shop-user',
    icon: <UserOutlined />,
    content: <UserSetting />,
  },
  {
    label: 'Settings',
    link: 'settings',
    icon: <SettingOutlined />,
    content: <Settings />,
  },
];

function Menu() {

    const shop  = useSelector(selectShop);
    
    const [currentMenu, setCurrentMenu] = useState(menus[0]);
    const [collapsed, setCollapsed] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    console.log("aaa");

    const dispatch = useDispatch();
    // Dispatch setAuth() only if shop data is not already set
    if(!shop){
        dispatch(setAuth({
            shop : {
                _id : 'shop test id',
                name : 'Shop test name',
                userId : 'User test id',
                role : 1,
            },
            token : 'testToken',
        }));
        console.log("222");
    }

    let menuLink = searchParams.get('menu');

    useEffect(() => {
        //menuLink = searchParams.get('menu');
        if (shop && menuLink) {
          setCurrentMenu(menus.find((item) => item.link === menuLink));
        } else {
          setCurrentMenu(menus[0]);
        }
    }, [menuLink]); 

    
    
    console.log(shop);
    
    const handleMenuClick = (menu) => {
      setCurrentMenu(menu);
      navigate(`/?menu=${menu.link}`);
    };

    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
    };

    return (
        <CustomLayout>
            <div style={{ display: 'flex' }}> {/* Ensure side-by-side layout */}
                <Sider 
                    collapsible 
                    collapsed={collapsed} 
                    onCollapse={toggleCollapsed}
                >
                    <div className="avatar-field">
                        <Avatar size={50} icon={<UserOutlined />} />
                        {!collapsed && (
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>
                                    Shop name: {shop?.name}
                                </div>
                            </div>
                        )}    
                    </div>
                    <AntMenu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[currentMenu.link]}
                        defaultOpenKeys={['sub1']}
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
            </div>
        </CustomLayout>
    );
}

export default Menu;