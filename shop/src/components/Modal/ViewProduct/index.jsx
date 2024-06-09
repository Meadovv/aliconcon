import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Spinner,
    Input,
    Textarea,
    Stack,
    Select
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';

import { useNavigate } from 'react-router-dom';

export default function ViewProduct({ id, setId, setProducts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const [vouchers, setVouchers] = React.useState([]);
    const navigate = useNavigate();

    const getProduct = async () => {
        onOpen();
        await axios.post(api.GET_PRODUCT, { productId: id }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            setProduct(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
    };

    const getVouchers = async () => {
        await axios.post(api.GET_VOUCHERS, {}, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            setVouchers(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        if (!id) return;
        getProduct();
        getVouchers();
    }, [id]);

    const onSave = async () => {
        setLoading(true);
        await axios.post(api.UPDATE_PRODUCT, { product }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
            onCloseModal();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    const onDelete = async () => {
        setLoading(true);
        await axios.post(api.DELETE_PRODUCT, { productId: id }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
        onCloseModal();
    }

    const onCloseModal = async () => {
        setId(null);
        setProduct(null);
        onClose();  
    }

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal} size='6xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {product ? 
                    <Stack>
                        <label>Name</label>
                        <Input value={product.name} onChange={(e) => {
                            if(product.status === 'draft') {
                                setProduct({...product, name: e.target.value})
                            } else {
                                message.error('Cannot edit published product');
                            }
                        }}/>
                        
                        <label>Short Description</label>
                        <Input value={product.short_description} onChange={(e) => {
                            if(product.status === 'draft') {
                                setProduct({...product, short_description: e.target.value})
                            } else {
                                message.error('Cannot edit published product');
                            }
                        }}/>

                        <label>Description</label>
                        <Textarea value={product.description} onChange={(e) => {
                            if(product.status === 'draft') {
                                setProduct({...product, description: e.target.value})
                            } else {
                                message.error('Cannot edit published product');
                            }
                        }}/>

                        <label>Price</label>
                        <Input type='number' value={product.price} onChange={(e) => {
                            if(product.status === 'draft') {
                                setProduct({...product, price: e.target.value})
                            } else {
                                message.error('Cannot edit published product');
                            }
                        }}/>

                        <label>Voucher</label>
                        <Select
                                placeholder="Select Voucher"
                                value={product?.sale ? product.sale : ''}
                                onChange={(e) => {
                                    if (e.target.value === 'other') {
                                        navigate('/vouchers');
                                    } else {
                                        setProduct({ ...product, sale: e.target.value });
                                    }
                                }}
                            >
                                <option
                                    value="other"
                                    style={{
                                        color: 'blue',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Add Category
                                </option>
                                {vouchers.map((voucher) => (
                                    <option key={voucher._id} value={voucher._id}>
                                        {voucher.name} ({voucher.discount}%)
                                    </option>
                                ))}
                            </Select>


                        <label>Variation</label>
                        {product.variations.map((variation, index) => {
                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <label style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}>Option {index + 1}: {variation?.name}</label>
                                    <hr style={{
                                        width: '100%',
                                        margin: '10px 0'
                                    }}/>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '50%',
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <label>Quantity</label>
                                            <Input value={variation?.quantity} onChange={(e) => {
                                                const tempVariation = product.variations;
                                                tempVariation[index].quantity = e.target.value;
                                                setProduct({...product, variation: tempVariation})
                                            }}/>
                                        </div>
                                        <div style={{
                                            width: '50%',
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <label>Price</label>
                                            <Input value={variation?.price} onChange={(e) => {
                                                const tempVariation = product.variations;
                                                tempVariation[index].price = e.target.value;
                                                setProduct({...product, variation: tempVariation})
                                            }}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Stack>: <Spinner />}
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={onCloseModal}
                        isLoading={loading}
                    >
                        Close
                    </Button>
                    <Button
                        colorScheme="red"
                        mr={3}
                        onClick={onDelete}
                        isLoading={loading}
                    >
                        Delete
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={onSave}
                        type="submit"
                        isLoading={loading}
                        loadingText="Saving..."
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
