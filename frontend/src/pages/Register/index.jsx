import { Button, Form, Input } from 'antd'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {

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
                    }}>Aliconcon Ecommerce</div>
                    <Form
                        layout='vertical'
                        style={{
                            width: '80%'
                        }}
                        onFinish={register}
                    >
                        <Form.Item
                            label='Name'
                            name='name'
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
                            label='Email'
                            name='email'
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
                            <Input size='large'/>
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