import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Form, Modal, Input, Button, message } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';

function Products(categoryId) {
    const { user } = useSelector((state) => state.user);
    const [productList, setProductList] = useState([]);
    const [productFilter, setProductFilter] = useState([]);

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
            .post(CONFIG.API + '/product/get-by-shop', {
                shopId: user.shopId,
                category: categoryId
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
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter product name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter product description!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter product price!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item
                        label="Thumbnail"
                        name="thumbnail"
                        rules={[{ required: true, message: 'Please enter product thumbnail URL!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        initialValue="draft"
                        rules={[{ required: true, message: 'Please select product status!' }]}
                    >
                        <Select>
                            <Option value="draft">Draft</Option>
                            <Option value="published">Published</Option>
                            <Option value="unpublished">Unpublished</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Product
                        </Button>
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
                                            disabled={user.role > 1}
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
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => deleteProduct(product._id)}
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


export default Products;
