import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Modal, Input, Button, message, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import { selectShop } from '../../reducer/actions/auth.slice';
import CONFIG from '../../configs';

function Settings() {
    const shop = useSelector(selectShop);

    const navigate = useNavigate();

    const [reload, setReload] = useState(true);

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
    });

    const handleForm = async () => {
        const formValues = await form.validateFields();
        await axios
            .post(CONFIG.API + '/shop/change-password'
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
                setFormMode({
                    open: false,
                });
                form.resetFields();
                setReload((prev) => prev + 1);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    useEffect(() => {
        
    }, [reload]);
    
    return (
        <div>
            <div>
                <Modal
                    forceRender
                    title='Change shop Password'
                    open={formMode.open}
                    onOk={handleForm}
                    onCancel={() =>
                        setFormMode({
                            open: false,
                        })
                    }
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item
                            label="Old Password"
                            name="old_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input old password!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="New Password"
                            name="new_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input new password!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <div>
                    <div
                        style={{
                            display: shop.role < 2 ? 'flex' : 'none',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div><b>Shop name: {shop.name}</b></div>
                        <br/>
                        <div>User: {shop.userId}</div>
                    </div>
                </div>

                <div
                    style={{
                        display: shop.role < 2 ? 'flex' : 'none',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Danger Zone</div>
                    <Button
                        danger ghost
                        size='large'
                        onClick={() => deleteUser(user.email)}
                        disabled={shop.role > 1}
                    >
                        Change your password
                    </Button>
                </div>

                <div
                    style={{
                        display: shop.role < 2 ? 'flex' : 'none',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Danger Zone</div>
                    <Button type="primary" danger ghost size="large">
                        Delete Shop
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Popconfirm
                        title="Logout"
                        description="Are you sure to logout?"
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                            type: 'primary',
                            danger: true,
                            size: 'large',
                        }}
                        cancelButtonProps={{
                            size: 'large',
                            type: 'primary',
                        }}
                        onConfirm={() => navigate('/logout')}
                    >
                        <Button type="primary" danger size="large">
                            Logout
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </div>
    );
}

export default Settings;