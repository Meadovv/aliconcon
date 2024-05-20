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
            <div>Role: {role(shop.role)}</div>
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

    // Dispatch setAuth() only if shop data is not already set in testing
    if(!shop){
        dispatch(setAuth({
            _id : 'shop test id',
            name : 'Shop test name',
            userId : 'User test id',
            role : 1,
        }));
        console.log("222");
    }
    // Testing ----------------------------------------------------------

    let menuLink = searchParams.get('menu');

    useEffect(() => {
        if (menuLink) {
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
            <div style={{ display: 'flex', height: '100%', width: '100%'}}> {/* Ensure side-by-side layout */}
                <Sider 
                    collapsible 
                    collapsed={collapsed} 
                    onCollapse={toggleCollapsed}
                    style={{ marginLeft: '5px' }}
                >
                    <div 
                        className="avatar-field" 
                        style={{ 
                              marginTop: '20px'
                            , height: '150px'
                            , backgroundColor: 'white'
                            , boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                            , padding: '10px'
                            , borderRadius: '10px'
                        }}
                    >
                        <Avatar size={70} icon={<ShopOutlined />} style={{backgroundColor: 'blue'}}/>
                        {!collapsed && (
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'black', marginTop: '15px' }}>
                                    Shop 
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', marginTop: '5px' }}>
                                    {shop?.name}
                                </div>
                            </div>
                        )}    
                    </div>
                    <div className="menu-field" >
                        <AntMenu
                            mode="inline"
                            selectedKeys={[currentMenu.link]}
                            defaultOpenKeys={['sub1']}
                            style={{ 
                                  borderRadius: '10px'
                                , backgroundColor: 'white'
                                , boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                                , marginTop: '20px'
                                , padding: '3px'
                            }}
                        >
                            {menus.map((menu) =>
                                (
                                    <AntMenu.Item key={menu.link} icon={menu.icon} 
                                        onClick={() => handleMenuClick(menu)}
                                        style={{color: 'white', backgroundColor: currentMenu === menu ? 'blue' : 'skyblue' }}
                                    >
                                        {menu.label}
                                    </AntMenu.Item>
                                )
                            )}
                        </AntMenu>
                    </div>
                </Sider>
                <Content 
                    style={{ 
                        marginLeft: collapsed ? 20 : 10
                        , padding: '20px'
                        , borderRadius:'5px'                                
                        , backgroundColor: 'white'
                        , boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                        , marginTop: '20px'
                    }}>
                    {currentMenu.content}
                </Content>
            </div>
        </CustomLayout>
    );
}

export default Menu;