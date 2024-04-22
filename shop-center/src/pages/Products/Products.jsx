import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {Checkbox, Radio, Form, Modal, Input, Button, message } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';
import { selectShop } from '../../reducer/actions/shop.slice';

function Products() {
    const { shop } = useSelector(selectShop);
    const [productyList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
    });

    const deleteProduct = async (productId) => {
        message.success('Product delete successfully ' + productId);
    };

    const getProductList = async () => {
        await axios
            .post(CONFIG.API + '/product/get-list-by-shop', {
                shopId: shop._id,
            })
            .then((res) => {
                message.success(res.data.message);
                setProductList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

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

    useEffect(() => {
        getProductList();
        getCategoryList();

    }, [reload]);

    useEffect(() => {
        if (filter === 'all') {
            setProductFilter(productyList);
        } else setProductFilter(productyList.filter((primary) => producty.status === filter));
    }, [filter, productyList]);

    const handleForm = () => {
        form.validateFields().then(async (formValues) => {
            await axios
                .post(CONFIG.API + '/product/create', formValues, {
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
                <div>
                    <Modal
                        forceRender
                        title={formMode.mode === 'add' ? 'Add Product' : 'Edit Product'}
                        open={formMode.open}
                        onOk={handleForm}
                        onCancel={() =>
                            setFormMode({
                                ...formMode,
                                open: false,
                            })
                        }
                        okText="Add"
                        okButtonProps={{ size: 'large', }}
                        cancelButtonProps={{ size: 'large', }}
                        width={1000}
                    >
                        <Form layout="vertical" form={form}>
                            <Form.Item
                                label="Product Name" name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input product name!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item 
                                label="Product Thumbnail" name="thumbnail"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input product thumbnail!',
                                    },
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item 
                                label="Product Categories"  name="categories" 
                                rules={[
                                    { 
                                        required: true, 
                                        message: 'Please select product categories!' 
                                    }
                                ]}
                            >
                                <Checkbox.Group>
                                    {categoryList.map(category => (
                                        <Checkbox key={category._id} value={category._id}>{category.name}</Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </Form.Item>
                        </Form>
                    </Modal>


                    <div style={{ display: 'flex', justifyContent: 'space-between', }} >
                        <div style={{ display: 'flex', gap: '10px', }}
                        >
                            <div> View Mode </div>
                            <Radio.Group  value={filter}  onChange={(e) => setFilter(e.target.value)}>
                                <Radio value="all">All</Radio>
                                <Radio value="draft">Draft</Radio>
                                <Radio value="published">Published</Radio>
                            </Radio.Group>
                        </div>

                        <Button
                            type="primary" ghost
                            onClick={() => {
                                setFormMode({
                                    open: true,
                                    mode: 'add',
                                });
                            }}
                        >
                            Add new product 
                        </Button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', }} >
                        {productFilter &&
                            productFilter.map((product, index) => {
                                return (
                                    <div
                                        key={index}
                                        style={{ padding: '20px', display: 'flex', gap: '10px', }}
                                    >
                                        <img
                                            src={product.thumbnail}  alt="thumbnail"
                                            style={{ width: '80px', }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', }} >

                                            <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'center', }} >
                                                {product.name}
                                            </div>

                                            <div style={{ display: 'flex', }} >
                                                - Categories: {product.categories}
                                                - Attributes: {product.attributes}
                                                - Comments: {product.comments}
                                                - Price: {product.price}
                                                - Description: 
                                                <div> {product.description} </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', }} >
                                                <Button
                                                    type="primary"
                                                    ghost
                                                    danger={product.status === 'draft' ? false : true}
                                                    disabled={shop.role > 1}
                                                >
                                                    {product.status === 'draft' ? 'Activate' : 'Deactivate'}
                                                </Button>
                                                <Button
                                                    type="primary"  ghost
                                                    onClick={() => {
                                                        setFormMode({
                                                            open: true,
                                                            mode: 'edit',
                                                        });
                                                    }}
                                                >
                                                    Edit product
                                                </Button>
                                                <Button
                                                    danger
                                                    onClick={() => deleteProduct(product._id)}
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
        </div>
    );
}


export default Products;
