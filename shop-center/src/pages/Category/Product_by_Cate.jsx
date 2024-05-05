import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Modal, Input, Button, message } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';
import { useSelector } from 'react-redux';
import { selectShop } from '../../reducer/actions/auth.slice';

function Product_by_Cate (categoryId) {
    const { shop } = useSelector(selectShop);
    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
        productId: null,
    });

    const addProduct = async (data) => {
        await axios
            .post(CONFIG.API + '/shop/create-product'
                , data 
                , {
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

    const getProductList = async () => {
        await axios
            .post(CONFIG.API + '/shop/get-products', {
                shopId: shop._id,
                categoryId: categoryId,
            })
            .then((res) => {
                message.success(res.data.message);
                setProductList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        getProductList();
    }, [reload]);

    useEffect(() => {
        if (filter === 'all') {
            setProductFilter(productFilter);
        } else setProductFilter(productList.filter((product) => product.status === filter));
    }, [filter, productList]);

    const handleForm = async () => {
        try {
            const formValues = await form.validateFields();
            if (formMode.mode === 'edit') {
                deleteProduct(formMode.productId);
                addProduct(formValues);
            }
            else if(formMode.mode === 'add'){
                addProduct(formValues);
            }
            form.resetFields();
            setReload((prev) => prev + 1);
        } catch (error) {
            message.error(error.message);
        }

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
                        label="Product Description" name="short_description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a short description!',
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
                                productId: null,
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
                    {productFilter &&
                        productFilter.map((product, index) => {
                            return (
                                <div
                                    key={index}
                                    style={{
                                        padding: '20px',
                                        display: 'flex',
                                        gap: '10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                        }}
                                    >
                                        <Card
                                            key={product._id}
                                            hoverable
                                            style={{ width: 300, marginBottom: 16 }}
                                            cover={<img alt="thumbnail" src={product.thumbnail} style={{ width: '100%' }} />}
                                        >
                                            <Card.Meta title={product.name} />
                                        </Card>

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
                                                danger={product.status === 'draft' ? false : true}
                                                disabled={shop.role > 1}
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
                                                        productId: product._id,
                                                    });
                                                }}
                                            >
                                                Edit
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


export default Product_by_Cate;
