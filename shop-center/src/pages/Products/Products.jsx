import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {Checkbox, Radio, Form, Modal, Input, Button, message } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';
import { selectShop } from '../../reducer/actions/auth.slice';

function Products() {
    const shop = useSelector(selectShop);
    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
    });

    const getProducts = async () => {
        await getCategoryList()
        .then(categoryList.map((category) => {
            getProductList(category.categoryId);
        }))
    };

    const deleteProduct = async (productId) => {
        await axios
            .post(CONFIG.API + '/shop/delete-product', 
                {
                    productId : productId,
                },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('x-client-id'),
                        'x-token-id': localStorage.getItem('x-token-id'),
                    },
                }
            )
            .then((res) => {
                message.success(res.data.message);
                setReload((prev) => prev + 1);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const getProductList = async (categoryId) => {
        await axios
            .get(CONFIG.API + '/shop/get-products'
                , {
                    shopId: shop._id,
                    categoryId: categoryId,
                }
            )
            .then((res) => {
                message.success(res.data.message);
                setProductList(productList.concat(res.data.message));
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const getCategoryList = async () => {
        await axios
            .get(CONFIG.API + '/shop/get-categories'
                , {
                    shopId: shop._id,
                }
            )
            .then((res) => {
                message.success(res.data.message);
                setCategoryList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        getProducts();
    }, [reload]);

    useEffect(() => {
        if (filter === 'all') {
            setProductFilter(productList);
        } else setProductFilter(productList.filter((product) => product.status === filter));
    }, [filter, productList]);

    const handleForm = () => {
        form.validateFields().then(async (formValues) => {
            await axios
                .post(CONFIG.API + '/shop/create-product'
                    , formValues
                    , {
                        headers: {
                            'x-client-id': localStorage.getItem('x-client-id'),
                            'x-token-id': localStorage.getItem('x-token-id'),
                        },
                    }
                )
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
                            label="Product Description" name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input product description!',
                                },
                            ]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item 
                            label="Product Categories"  name="category" 
                            rules={[
                                { 
                                    required: true, 
                                    message: 'Please select product category!' 
                                }
                            ]}
                        >
                            <Checkbox.Group>
                                {categoryList.map(category => (
                                    <Checkbox key={category._id} value={category._id}>{category.name}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item 
                            label="Product Price" name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input product price!',
                                },
                            ]}
                        >
                            <Input size="large" type="number" />
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
                            label="Product Variations" name="variations"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input product variations!',
                                },
                            ]}
                        >
                            <Input size="large" />
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

                <div>
                    {categoryList.map((category, categoryIndex) => (
                        <div key={categoryIndex} style={{ marginBottom: '20px' }}>
                            <h2 style={{ marginBottom: '10px' }}>{category.categoryName}</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                {productFilter.map((product, productIndex) => (
                                    <div key={productIndex} style={{ display: 'flex', flexDirection: 'column', gap: '10px', }}>
                                        <img src={product.thumbnail} alt="thumbnail" style={{ width: '80px' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', }}>
                                            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                            <div><b>Categories:</b> {product.categories}</div>
                                            <div><b>Attributes:</b> {product.attributes}</div>
                                            <div><b>Comments:</b> {product.comments}</div>
                                            <div><b>Price:</b> {product.price}</div>
                                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <b>Description:</b> {product.description}
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px', }}>
                                                <Button
                                                    type="primary"
                                                    ghost
                                                    danger={product.status === 'draft' ? false : true}
                                                    disabled={shop.role > 1}
                                                    style={{ flex: '1' }}
                                                >
                                                    {product.status === 'draft' ? 'Activate' : 'Deactivate'}
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
                                                    style={{ flex: '1' }}
                                                >
                                                    Edit product
                                                </Button>
                                                <Button
                                                    danger
                                                    onClick={() => deleteProduct(product._id)}
                                                    disabled={shop.role > 1}
                                                    style={{ flex: '1' }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                
            </div>
        </div>
    );
}


export default Products;
