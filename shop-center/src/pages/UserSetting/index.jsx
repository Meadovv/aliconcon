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
        user_email: null, // Used for editing mode
    });

    const getUserList = async () => {
        await axios
            .post(CONFIG.API + '/shop/get-user-list', {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id'),
                },
            })
            .then((res) => {
                message.success(res.data.message);
                setUserList(res.data.metadata);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const addUser = async (data) => {
        await axios
            .post(CONFIG.API + '/shop/add-user'
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

    const deleteUser = async (user_email) => {
        await axios
            .post(CONFIG.API + '/shop/delete-user', 
                {
                    target_email : user_email,
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

    const handleForm = async () => {
        try {
            const formValues = await form.validateFields();
            if (formMode.mode === 'edit') {
                deleteUser(formMode.user_email);
                addUser(formValues);
            }
            else if(formMode.mode === 'add'){
                addUser(formValues);
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

    useEffect(() => {
        getUserList();
    }, [reload]);

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
                            label="Password"
                            name="target_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input user password!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="user"
                            name="target_Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input user role!',
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
                            user_email: null,
                        });
                    }}
                >
                    Add User
                </Button>

                {/* Render user list */}
                <ul>
                    {userList.map(user => (
                        <li key={user._id}>
                            {user._id} - {user.email} - {user.role}
                            <Button
                                onClick={() => {
                                    setFormMode({
                                        open: true,
                                        mode: 'edit',
                                        user_email: user.email,
                                    });
                                    form.setFieldsValue(user);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                danger
                                onClick={() => deleteUser(user.email)}
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
