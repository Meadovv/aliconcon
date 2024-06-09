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
    Box,
    Text,
} from '@chakra-ui/react';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function ViewOrder({ id, setId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [order, setOrder] = React.useState(null);

    const getVoucher = async () => {
        onOpen();
        await axios
            .post(
                api.GET_ORDER,
                {
                    orderId: id,
                },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                setOrder(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    React.useEffect(() => {
        if (!id) return;
        getVoucher();
    }, [id]);

    const onCloseModal = async () => {
        setId(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View Voucher</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Text fontWeight="bold">Customer Information:</Text>
                        <Text>Name: {order?.user.name}</Text>
                        <Text>Phone: {order?.user.phone}</Text>
                        <Text>Address: {order?.user.address}</Text>
                    </Box>
                    <Box mt={4}>
                        <Text fontWeight="bold">Order Items:</Text>
                        {order?.items.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '1rem',
                                borderBottom: '1px solid #ccc',
                            }}>
                                <div>
                                    <div>Name: {item?.product.name}</div>
                                    <div>Option: {item?.variation.name}</div>
                                </div>
                                <div>Quantity: {item?.quantity}</div>
                            </div>
                        ))}
                    </Box>
                    <Box mt={4}>
                        <Text fontWeight="bold">Payment Information:</Text>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>Total:</div>
                            <div>đ{order?.total}</div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>Paid:</div>
                            <div>{order?.paid ? 'Paid' : 'Waiting'}</div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>Status:</div>
                            <div>{order?.status ? 'Completed' : 'Shipping'}</div>
                        </div>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onCloseModal} isLoading={loading}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
