import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button } from 'antd'; // Import Form, Input, Button from Ant Design
import CONFIG from '../../configs';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false); // State to manage form visibility
    const [form] = Form.useForm();

    const headers = {
        'x-client-id': localStorage.getItem('x-client-id'),
        'x-token-id': localStorage.getItem('x-token-id')
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post(CONFIG.API + "category/get-list-by-shop", { shopId: 'yourShopIdHere??' });
                setCategories(response.data.metadata);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleToggleForm = () => {
        // Toggle form visibility
        setShowForm(!showForm); 
    };

    const createCategory = () => {
        form.validateFields().then(async formValues => {
            try {
                const response = await axios.post(CONFIG.API + 'category/create', formValues, { headers });
                
                // Add newly created category to categories state
                setCategories([...categories, response.data.metadata]);

                // Reset form fields
                form.resetFields(); 
            } catch (error) {
                console.error('Error creating category:', error);
            }
        });
    };

    return (
        <div>
            <h2>Categories</h2>
            <Button onClick={handleToggleForm}>Add Category</Button> {/* Button to toggle form */}

            {showForm && ( // Render form if showForm is true
            <Form
            layout='vertical'
            style={{ width: '80%' }}
            onFinish={createCategory}
            form={form}
            >
                <Form.Item label="Category Name" name="name" rules={[{ required: true, message: 'Please enter category name!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Thumbnail" name="thumbnail" rules={[{ required: true, message: 'Please enter category thumbnail URL!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select category status!' }]}>
                    <Select defaultValue="draft">
                        <Option value="draft">Draft</Option>
                        <Option value="published">Published</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
        </Form>
            )}
            <ul>
                {categories.map(category => (
                    <li key={category._id}>
                        <h3>{category.name}</h3>
                        <p>Thumbnail: {category.thumbnail}</p>
                        <p>Status: {category.status}</p>
                        {/* Add more category attributes here */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
