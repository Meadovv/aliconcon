import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Form, Modal, Input, Button, message, Card, DatePicker, Space, InputNumber} from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';
import Layout from '../../components/Layout';

function Orders() {
    const { user } = useSelector((state) => state.user);
    const [orderList, setOrderList] = useState([]);
    const [orderFilter, setOrderFilter] = useState([]);

    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState('all');

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        index: -1
    });

    const [totalPrice, setTotalPrice] = useState(0);

    const deleteOrder = async (orderId) => {
        message.success('Order delete successfully ' + orderId);
    };

    const getOrderList = async () => {
        await axios
            .post(CONFIG.API + '/order/get-list-by-shop', {
                shopId: user.shopId,
            })
            .then((res) => {
                message.success(res.data.message);
                setOrderList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        getOrderList();
        
    }, [reload]);

    useEffect(() => {
        if (filter === 'all') {
            setOrderFilter(orderList);
        } 
        else setOrderFilter(orderList.filter((order) => order.status === filter));
    }, [filter, orderList]);

    const handleForm = () => {
        form.validateFields().then(async (formValues) => {
            await axios
                .post(CONFIG.API + '/order/create', formValues, {
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

    const handleValuesChange = changedValues => {
        if ('products' in changedValues) {
            form.validateFields(['products'], (errors, values) => {
                if (!errors) {
                    const products = values.products || [];
                    const calculatedTotalPrice = products.reduce((total, product) => {
                        return total + (product.quantity * product.price);
                    }, 0);
                    setTotalPrice(calculatedTotalPrice);
                    form.setFieldsValue({ price: calculatedTotalPrice });
                }
            });
        }
    };

    return (
        <Layout>
            <div>
                <Modal
                    forceRender
                    title={'Edit Product'}
                    open={formMode.open}
                    onOk={handleForm}
                    onCancel={() =>
                        setFormMode({
                            ...formMode,
                            open: false,
                        })
                    }
                    onValuesChange={handleValuesChange}
                    okText="Submit"
                    okButtonProps={{ size: 'large', }}
                    cancelButtonProps={{ size: 'large', }}
                    width={1000}
                >
                    <Form  layout="vertical"  form={form} initialValues={orderList[formMode.index]}> 
                        <Form.Item 
                            label="Order Name" name="name" 
                            rules={[{ required: true, message: 'Please input order name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Ship Organization" name="shipOrg">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Payment Date" name="paymentDate">
                            <DatePicker />
                        </Form.Item>

                        <Form.Item label="Create Date" name="createAt">
                            <DatePicker />
                        </Form.Item>

                        <Form.List name="discounts">
                            {(fields, { add, remove }) => (
                                <>
                                {fields.map((field) => (
                                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'discountId']}
                                        rules={[{ required: true, message: 'Please enter a discount ID' }]}
                                    >
                                        <Input placeholder="Discount ID" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Discount
                                    </Button>
                                </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item name="status" hidden>
                            <Input />
                        </Form.Item>

                        <Form.List name="products">
                            {(fields, { add, remove }) => (
                            <>
                                {fields.map((field) => (
                                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'productId']}
                                        rules={[{ required: true, message: 'Missing product ID' }]}
                                    >
                                        <Input placeholder="Product ID" />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'quantity']}
                                        rules={[{ required: true, message: 'Missing quantity' }]}
                                    >
                                        <Input placeholder="Quantity" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add product
                                    </Button>
                                </Form.Item>
                            </>
                            )}
                        </Form.List>

                        <Form.Item label="Total Price" name="price" hidden>
                            <InputNumber value={totalPrice} />
                        </Form.Item>
                    </Form>
                </Modal>


                <div style={{ display: 'flex', justifyContent: 'space-between', }} >
                    <div style={{ display: 'flex', gap: '10px', }}
                    >
                        <div> View Mode </div>
                        <Radio.Group  value={filter}  onChange={(e) => setFilter(e.target.value)}>
                            <Radio value="all">All</Radio>
                            <Radio value="Paid">Paid</Radio>
                            <Radio value="Unpaid">Unpaid</Radio>
                            <Radio value="Shipping">Shipping</Radio>
                        </Radio.Group>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {orderFilter && orderFilter.map((order, index) => (
                        <Card key={index} style={{ width: 300 }}>
                            <Card title={order.name} />
                            <p><b>Products:</b></p>
                            <ul>
                                {order.products.map(product => (
                                    <li key={product.productId}>
                                        {product.productId}: {product.quantity}
                                    </li>
                                ))}
                            </ul>
                            <p><b>Discounts:</b> {order.discounts.map(discount => discount.discountId).join(', ')}</p>
                            <p><b>Price:</b> {order.price}</p>
                            <p><b>Status:</b> {order.status}</p>
                            <p><b>Create date:</b> {order.createAt}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="primary" onClick={() => setFormMode({index: index, open: true})}>
                                    Edit 
                                </Button>
                                <Button danger onClick={() => deleteOrder(order._id)} disabled={user.role > 1}>
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
}


export default Orders;