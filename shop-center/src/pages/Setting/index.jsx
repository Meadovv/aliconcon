import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Radio, Form, Input, Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CONFIG from '../../configs';
import axios from 'axios';

function MyShop() {
    const { user } = useSelector((state) => state.user);
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div>Shop ID: {user.shopId}</div>
            <div>Shop Name: {user.shopName}</div>
        </div>
    );
}

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

function Products() {
    return <div>Products</div>;
}

function Categories() {
    const { user } = useSelector((state) => state.user);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
    });

    const deleteCategory = async (categoryId) => {
        message.success('Category delete successfully ' + categoryId);
    };

    const getCategoryList = async () => {
        await axios
            .post(CONFIG.API + '/category/get-list-by-shop', {
                shopId: user.shopId,
            })
            .then((res) => {
                message.success(res.data.message);
                setCategoryList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        getCategoryList();
    }, [reload]);

    useEffect(() => {
        if (filter === 'all') {
            setCategoryFilter(categoryList);
        } else setCategoryFilter(categoryList.filter((category) => category.status === filter));
    }, [filter, categoryList]);

    const handleForm = () => {
        form.validateFields().then(async (formValues) => {
            await axios
                .post(CONFIG.API + '/category/create', formValues, {
                    headers: {
                        'x-client-id': localStorage.getItem('x-client-id'),
                        'x-token-id': localStorage.getItem('x-token-id'),
                    },
                })
                .then((res) => {
                    message.success(res.data.message);
                    form.resetFields();
                    setReload((prev) => prev + 1);
                })
                .catch((err) => {
                    message.error(err.message);
                });
        });
        setFormMode({
            ...formMode,
            open: false,
        });
    };

    return (
        <div>
            <Modal
                forceRender
                title={formMode.mode === 'add' ? 'Add Category' : 'Edit Category'}
                open={formMode.open}
                onOk={handleForm}
                onCancel={() =>
                    setFormMode({
                        ...formMode,
                        open: false,
                    })
                }
                okText="Add"
                okButtonProps={{
                    size: 'large',
                }}
                cancelButtonProps={{
                    size: 'large',
                }}
                width={1000}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Category Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input category name!',
                            },
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Category Thumbnail"
                        name="thumbnail"
                        rules={[
                            {
                                required: true,
                                message: 'Please input category thumbnail!',
                            },
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>
                </Form>
            </Modal>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                    }}
                >
                    <div>View Mode</div>
                    <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <Radio value="all">All</Radio>
                        <Radio value="draft">Draft</Radio>
                        <Radio value="published">Published</Radio>
                    </Radio.Group>
                </div>

                <Button
                    type="primary"
                    ghost
                    onClick={() => {
                        setFormMode({
                            open: true,
                            mode: 'add',
                        });
                    }}
                >
                    Add
                </Button>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                }}
            >
                {categoryFilter &&
                    categoryFilter.map((category, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: '20px',
                                    display: 'flex',
                                    gap: '10px',
                                }}
                            >
                                <img
                                    src={category.thumbnail}
                                    alt="thumbnail"
                                    style={{
                                        width: '80px',
                                    }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            fontWeight: 'bold',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {category.name}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            ghost
                                            danger={category.status === 'draft' ? false : true}
                                            disabled={user.role > 1}
                                        >
                                            {category.status === 'draft' ? 'Activate' : 'Deactivate'}
                                        </Button>
                                        <Button
                                            type="primary"
                                            ghost
                                            onClick={() => {
                                                setFormMode({
                                                    open: true,
                                                    mode: 'edit',
                                                });
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => deleteCategory(category._id)}
                                            disabled={user.role > 1}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

function Orders() {
    return <div>Orders</div>;
}

function Settings() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <div>
                <div
                    style={{
                        display: user.role < 2 ? 'flex' : 'none',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Account List</div>
                    <div>
                        <Button type="primary" size="large" ghost>
                            Add Account
                        </Button>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: user.role < 2 ? 'flex' : 'none',
                    justifyContent: 'space-between',
                }}
            >
                <div>Danger Zone</div>
                <Button type="primary" danger ghost size="large">
                    Delete Shop
                </Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                }}
            >
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

function Setting() {
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

export default Setting;
