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
    Stack
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';

export default function ViewProduct({ id, setId, setProducts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);

    const getProduct = async () => {
        onOpen();
        await axios.post( api.GET_PRODUCT
        , { productId: id }
        , {
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

    React.useEffect(() => {
        if (!id) return;
        setLoading(true);
        getProduct();
        setLoading(false);
    }, [id]);

    const onSave = async () => {
        setLoading(true);
        await axios.post( api.UPDATE_PRODUCT
        , { product: product }
        , {
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
        await axios.post( api.DELETE_PRODUCT
        , { productId: id }
        , {
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
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View product</ModalHeader>
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
                        isDisabled={product && product.status === 'published'}
                    >
                        Delete
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={onSave}
                        type="submit"
                        isLoading={loading}
                        loadingText="Saving..."
                        isDisabled={product && product.status === 'published'}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
