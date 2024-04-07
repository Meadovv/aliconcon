import { Button, Form, Input, message } from 'antd'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../../configs';

export default function Login() {

    const [form] = Form.useForm();
    const navigate = useNavigate()

    const login = () => {
        form.validateFields()
        .then(async formValues => {
            await axios.post(CONFIG.API + '/auth/shop/login', formValues)
            .then(res => {
                message.success(res.data.message)
                localStorage.setItem('x-client-id', res.data.metadata.user._id);
                localStorage.setItem('x-token-id', res.data.metadata.token);
                navigate('/')
            })
            .catch(err => {
                console.log(err)
                message.error(err.response.data.message)
            })
            form.resetFields();
        })
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
                        onFinish={login}
                        form={form}
                    >
                        <Form.Item
                            label='Shop Email'
                            name='shopEmail'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}
                        >
                            <Input size='large'/>
                        </Form.Item>

                        <Form.Item
                            label='User Email'
                            name='userEmail'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input size='large'/>
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
                            <Input.Password size='large'/>
                        </Form.Item>
                        
                        <Form.Item>
                            <div>Don't have account yet? <strong style={{
                                color: 'var(--primary-color)',
                                cursor: 'pointer'
                            }} onClick={() => navigate('/register')}>Register</strong></div>
                        </Form.Item>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <Button htmlType='submit' type='primary' size='large'>Login Now!</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}