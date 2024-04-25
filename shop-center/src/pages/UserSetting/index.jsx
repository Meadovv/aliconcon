import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Modal, Input, Button, message } from 'antd';
import Layout from '../../components/Layout';
import { useSelector } from 'react-redux';
import { selectShop } from '../../reducer/actions/auth.slice';

function UserSetting() {
    const shop = useSelector(selectShop);
    
    const [userList, setUserList] = useState([]);
    const [reload, setReload] = useState(true);

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
        userId: null, // Used for editing mode
    });

    const getUserList = async () => {
        // Fetch user list data from API
        try {
            const response = await axios.get(CONFIG.API + 'shop/get-user-list', {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id'),
                },
            });
            setUserList(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        getUserList();
    }, [reload]);

    const deleteUser = async (productId) => {
        message.success('Product delete successfully ' + productId);
    };

    const handleForm = async () => {
        try {
            const formValues = await form.validateFields();
            let endpoint = formMode.mode === 'add' ? '/shop/add-user' : '/shop/update-user';
            if (formMode.mode === 'edit') {
                endpoint += `${formMode.userId}`; 
            }
            const response = await axios.post(CONFIG.API + endpoint, formValues, {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id'),
                },
            });
            message.success(response.data.message);
            form.resetFields();
            setReload(prev => !prev);
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
                <Modal
                    forceRender
                    title={formMode.mode === 'add' ? 'Add User' : 'Edit User'}
                    open={formMode.open}
                    onOk={handleForm}
                    onCancel={() =>
                        setFormMode({
                            ...formMode,
                            open: false,
                        })
                    }
                    okText="Save"
                    cancelText="Cancel"
                >
                    <Form layout="vertical" form={form}>
                        <Form.Item
                            label="Email"
                            name="target_email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input user email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Pssword"
                            name="target_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Role"
                            name="target_role"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

                <Button
                    type="primary"
                    onClick={() => {
                        setFormMode({
                            open: true,
                            mode: 'add',
                            userId: null,
                        });
                    }}
                >
                    Add User
                </Button>

                {/* Render user list */}
                <ul>
                    {userList.map(user => (
                        <li key={user.userId}>
                            {user.name} - {user.email} - {user.username} - {user.address}
                            <Button
                                onClick={() => {
                                    setFormMode({
                                        open: true,
                                        mode: 'edit',
                                        userId: user.userId,
                                    });
                                    form.setFieldsValue(user);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                danger
                                onClick={() => deleteUser(user._id)}
                                disabled={shop.role > 1}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
    );
}

export default UserSetting;
