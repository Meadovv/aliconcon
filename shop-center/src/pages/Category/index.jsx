import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Modal, Input, Button, message, Radio } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';
import { selectShop, selectToken } from '../../reducer/actions/shop.slice';

function Categories() {
    const shop = useSelector(selectShop);
    const token = useSelector(selectToken);

    const [categoryList, setCategoryList] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
    });

    // Testing 
    setCategoryList([
        {
            name: "Electronics",
            thumbnail: "https://cdn.britannica.com/02/162502-050-FEEA94DE/Vulture.jpg",
            status: "published"
        },
        {
            name: "Clothing",
            thumbnail: "https://cdn.britannica.com/02/162502-050-FEEA94DE/Vulture.jpg",
            status: "published"
        },
        {
            name: "Books",
            thumbnail: "https://cdn.britannica.com/02/162502-050-FEEA94DE/Vulture.jpg",
            status: "draft"
        }
    ]);

    const deleteCategory = async (categoryId) => {
        message.success('Category delete successfully ' + categoryId);
    };



    /*
    const getCategoryList = async () => {
        await axios
            .post(CONFIG.API + '/category/get-list-by-shop', {
                shopId: shop._id,
            })
            .then((res) => {
                message.success(res.data.message);
                setCategoryList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };
    */

    /*
    useEffect(() => {
        getCategoryList()
    }, [reload]);
    */

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
        <Layout>
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
                                                disabled={shop.role > 1}
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
                                                disabled={shop.role > 1}
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
        </Layout>
        );
}


export default Categories;
