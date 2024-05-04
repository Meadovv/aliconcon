import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Modal, Input, Button, message } from 'antd';
import CONFIG from '../../configs';

function VariationSetting ( {productId, variation_tier_idx} ) {
    const [variationList, setVariationList] = useState([]);
    const [reload, setReload] = useState(true);

    const [form] = Form.useForm();
    const [formMode, setFormMode] = useState({
        open: false,
        mode: 'add',
        variationId: null, // Used for editing mode
    });

    const getVariationList = async ({productId, variation_tier_idx}) => {
        await axios
            .post(CONFIG.API + '/shop/get-variation'
                , {
                    productId: productId,
                    variation_tier_idx: variation_tier_idx,
                }
                , {
                    headers: {
                        'x-client-id': localStorage.getItem('x-client-id'),
                        'x-token-id': localStorage.getItem('x-token-id'),
                    },
            })
            .then((res) => {
                message.success(res.data.message);
                setVariationList(res.data.variations);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const addVariation = async (data) => {
        await axios
            .post(CONFIG.API + '/shop/create-variation', data, {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id'),
                },
            })
            .then((res) => {
                message.success(res.data.message);
                setReload((prev) => prev + 1);
            })
            .catch((err) => {
                message.error(err.message);
            });
    };

    const deleteVariation = async (variationId) => {
        await axios
            .post(CONFIG.API + '/shop/delete-variation', { variationId }, {
                headers: {
                    'x-client-id': localStorage.getItem('x-client-id'),
                    'x-token-id': localStorage.getItem('x-token-id'),
                },
            })
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
                deleteVariation(formMode.variationId);
                addVariation(formValues);
            }
            else if(formMode.mode === 'add'){
                addVariation(formValues);
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
        getVariationList({productId, variation_tier_idx});
    }, [reload]);

    return (
        <div>
            <Modal
                forceRender
                title={formMode.mode === 'add' ? 'Add Variation' : 'Edit Variation'}
                open ={formMode.open}
                onOk={handleForm}
                onCancel={() => setFormMode({ ...formMode, open: false })}
                okText="Save"
                cancelText="Cancel"
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input variation name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input variation price!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please input variation quantity!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>

            <Button
                type="primary"
                onClick={() => {
                    setFormMode({ open: true, mode: 'add', variationId: null });
                }}
            >
                Add Variation
            </Button>

            <ul>
                {variationList.map(variation => (
                    <li key={variation._id}>
                        {variation._id} - {variation.name} - ${variation.price} - Qty: {variation.quantity}
                        <Button
                            onClick={() => {
                                setFormMode({ open: true, mode: 'edit', variationId: variation._id });
                                form.setFieldsValue(variation);
                            }}
                        >
                            Edit
                        </Button>
                        <Button danger onClick={() => deleteVariation(variation._id)}>
                            Delete
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VariationSetting;
