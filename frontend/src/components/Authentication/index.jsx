import { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import CONFIG from '../../configs'
import { useNavigate } from 'react-router-dom';

import { setUser } from '../../reducer/actions/user.slice';
import { useDispatch } from 'react-redux'

export default function Authentication({ openModal, setOpenModal }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const login = () => {
        form.validateFields().then(async (formValues) => {
            await axios.post(CONFIG.API + '/auth/user/login', formValues,
            {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id')
                }
            })
            .then(response => {
                if(response.status === 200) {
                    message.success(response.data.message)
                    const metadata = response.data.metadata
                    dispatch(setUser(metadata.user))
                    localStorage.setItem('x-client-id', metadata.user._id)
                    localStorage.setItem('x-token-id', metadata.token)
                    setOpenModal(false);
                }
            })
            .catch(err => {
                localStorage.clear();
                dispatch(setUser(null))
            })
            form.resetFields();
        });
    };

    return (
        <Modal
            forceRender
            open={openModal}
            onCancel={() => setOpenModal(false)}
            footer={[
                <Button key="loginBtn" type="primary" size="large" onClick={login}>
                    Login
                </Button>,
            ]}
            confirmLoading={loading}
            width={1000}
        >
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img style={{ width: '200px' }} src="/images/logo.png" alt="logo" />
                    <div
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Aliconcon Ecommerce
                    </div>
                </div>

                <div>
                    <Form layout="vertical" form={form}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Username"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                type="password"
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>
                    </Form>

                    <div>Don't have account yet? <strong style={{
                        color: 'var(--primary-color)',
                        cursor: 'pointer'
                    }} onClick={() => navigate('/register')}>Register now</strong></div>
                </div>
            </div>
        </Modal>
    );
}
