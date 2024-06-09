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
    Stack,
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';
import DatePicker from 'react-datepicker';

export default function ViewVoucher({ id, setId, setVouchers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [voucher, setVoucher] = React.useState(null);

    const getVoucher = async () => {
        onOpen();
        await axios
            .post(
                api.GET_VOUCHER,
                { voucherId: id },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                setVoucher(res.data.metadata);
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

    const onSave = async () => {
        setLoading(true);
        await axios
            .post(
                api.UPDATE_VOUCHER,
                {
                    voucher: voucher,
                },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setVouchers(res.data.metadata);
                onCloseModal();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const onDelete = async () => {
        setLoading(true);
        await axios
            .post(
                api.DELETE_VOUCHER,
                { voucherId: id },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setVouchers(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
        onCloseModal();
    };

    const onCloseModal = async () => {
        setId(null);
        setVoucher(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View Voucher</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {voucher ? (
                        <Stack>
                            <label>Name</label>
                            <Input
                                value={voucher.name}
                                onChange={(e) => {
                                    if (!voucher.status) {
                                        setVoucher({ ...voucher, name: e.target.value });
                                    } else {
                                        message.error('Cannot edit published voucher');
                                    }
                                }}
                            />

                            <label>Description</label>
                            <Input
                                value={voucher.description}
                                onChange={(e) => {
                                    if (!voucher.status) {
                                        setVoucher({ ...voucher, description: e.target.value });
                                    } else {
                                        message.error('Cannot edit published voucher');
                                    }
                                }}
                            />

                            <label>Discount</label>
                            <Input
                                type="number"
                                value={voucher.discount}
                                onChange={(e) => {
                                    if (!voucher.status) {
                                        setVoucher({ ...voucher, discount: e.target.value });
                                    } else {
                                        message.error('Cannot edit published voucher');
                                    }
                                }}
                            />

                            <label>Start Date</label>
                            <DatePicker
                                selected={voucher.startDate}
                                onChange={(date) => {
                                    if (!voucher.status) {
                                        setVoucher({ ...voucher, startDate: date });
                                    } else {
                                        message.error('Cannot edit published voucher');
                                    }
                                }}
                            />

                            <label>End Date</label>
                            <DatePicker
                                selected={voucher.endDate}
                                onChange={(date) => {
                                    if (!voucher.status) {
                                        setVoucher({ ...voucher, startDate: date });
                                    } else {
                                        message.error('Cannot edit published voucher');
                                    }
                                }}
                            />
                        </Stack>
                    ) : (
                        <Spinner />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onCloseModal} isLoading={loading}>
                        Close
                    </Button>
                    <Button
                        colorScheme="red"
                        mr={3}
                        onClick={onDelete}
                        isLoading={loading}
                        isDisabled={voucher && voucher.status}
                    >
                        Delete
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={onSave}
                        type="submit"
                        isLoading={loading}
                        loadingText="Saving..."
                        isDisabled={voucher && voucher.status}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
