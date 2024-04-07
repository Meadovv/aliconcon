import { Button, Form, Input, Tooltip } from 'antd'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Authentication() {

    const [form] = Form.useForm();
    const navigate = useNavigate()

    const register = () => {
        
    }

    useEffect(() => {
        if(localStorage.getItem('x-client-id') && localStorage.getItem('x-token-id')) {
            navigate('/')
        }
    }, [])

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="side pc-only">
                    <img style={{ width: '300px' }} src="/images/logo.png" alt="logo" />
                </div>
                <div className="side">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        padding: '10px'
                    }}>Aliconcon Shop Center</div>
                    <Form
                        layout='vertical'
                        style={{
                            width: '80%'
                        }}
                        onFinish={register}
                    >
                        <Form.Item
                            label='Shop Name'
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your shop name!',
                                },
                            ]}
                        >
                            <Input size='large'/>
                        </Form.Item>

                        <Form.Item
                            label='Shop Email'
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your shop email!',
                                },
                            ]}
                        >
                            <Input size='large'/>
                        </Form.Item>

                        <Form.Item
                            label='User Email'
                            name='email'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Tooltip
                                title='This email must match the email you used to register for Aliconcon'
                            >
                                <Input size='large'/>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item
                            label='Password'
                            name='password'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Tooltip
                                title='This password must match the password you used to register for Aliconcon'
                            >
                                <Input size='large'/>
                            </Tooltip>
                        </Form.Item>

                        <Form.Item
                            label='Phone'
                            name='phone'
                        >
                            <Input size='large'/>
                        </Form.Item>

                        <Form.Item
                            label='Address'
                            name='address'
                        >
                            <Input size='large'/>
                        </Form.Item>
                        
                        <Form.Item>
                            <div>Already have an account? <strong style={{
                                color: 'var(--primary-color)',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/login')}>Login</strong></div>
                        </Form.Item>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Button htmlType='submit' type='primary' size='large'>Register Now!</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}