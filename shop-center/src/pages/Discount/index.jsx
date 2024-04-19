import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Modal, Input, Button, message } from 'antd'; // Import Form, Input, Button from Ant Design
import Layout from '../../components/Layout';

function Discounts() {
    const [discountList, setDiscountList] = useState([]);
    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
    });

    const deleteDiscount = async (discountId) => {
        // Implement delete discount functionality
        message.success('Discount deleted successfully');
    };

    const getDiscountList = async () => {
        // Fetch discount data from API and update state
        try {
            const response = await axios.post(CONFIG.API + '/discount/get-list', 
                {shopId: user.shopId}
            );
            setDiscountList(response.data.metadata);
            message.success(response.data.message);
        } catch (error) {
            message.error(error.message);
        }
    };

    useEffect(() => {
        getDiscountList();
    }, []);

    const handleForm = () => {
        // Handle form submission for adding/editing discounts
        form.validateFields().then(async (formValues) => {
            try {
                const response = await axios.post(CONFIG.API + '/discount/create', formValues, {
                    headers: {
                        'x-client-id': localStorage.getItem('x-client-id'),
                        'x-token-id': localStorage.getItem('x-token-id'),
                    },
                });
                message.success(response.data.message);
                form.resetFields();
                setFormMode({ ...formMode, open: false });
                getDiscountList(); // Refresh discount list after adding/editing
            } catch (error) {
                message.error(error.message);
            }
        });
    };

    return (
        <Layout>
            <Modal
                title={formMode.mode === 'add' ? 'Add Discount' : 'Edit Discount'}
                open={formMode.open}
                onOk={handleForm}
                onCancel={() => setFormMode({ ...formMode, open: false })}
                okText="Save"
                cancelButtonProps={{ size: 'large' }}
                width={600}
            >
                <Form layout="vertical" form={form}>
                    {/* Form fields for discount attributes */}
                    <Form.Item label="Discount Name" name="name" rules={[{ required: true, message: 'Please enter discount name' }]}>
                        <Input />
                    </Form.Item>
                    {/* Add more form fields for other discount attributes */}
                </Form>
            </Modal>

            {/* Button to toggle modal for adding new discount */}
            <Button type="primary" onClick={() => setFormMode({ open: true, mode: 'add' })}>
                Add Discount
            </Button>

            {/* Display list of discounts */}
            <div>
                {discountList.map((discount, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        {/* Display discount attributes */}
                        <div>Discount ID: {discount.discountId}</div>
                        <div>Discount Name: {discount.name}</div>
                        <div>Create date: {discount.createAt}</div>
                        <div>Expire date: {discount.expiredAt}</div>
	                    <div>Discount scope: {discount.discountScope}</div>
                        {/* Provide options to edit/delete discounts */}
                        <Button type="primary" onClick={() => setFormMode({ open: true, mode: 'edit' })}>
                            Edit
                        </Button>
                        <Button type="danger" onClick={() => deleteDiscount(discount.discountId)}>
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}

export default Discounts;
