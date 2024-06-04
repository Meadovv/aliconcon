import { 
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    ModalFooter, ModalCloseButton, Button, Spinner, Input,  Stack, FormControl, FormLabel
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';
import ViewItemByVouModal from '../../view-by-modal/ViewItemByVoucher';

export default function ViewVoucher({ id, setId, setVouchers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [voucher, setVoucher] = React.useState(null);
    const [items, setItems] = React.useState([]);

    {/* View Items detail */}
    const viewItem = () => {
        setItems(voucher.items)
    };

    const getVoucher = async () => {
        onOpen();
        setLoading(true);
        await axios.post( api.GET_VOUCHER
        , { voucherId: id }
        , {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            setVoucher(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    };

    const onSave = async () => {
        setLoading(true);
        await axios.post( api.UPDATE_VOUCHER
        , { voucher: voucher }
        , {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setVouchers(res.data.metadata);
            onCloseModal();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    const onDelete = async () => {
        setLoading(true);
        await axios.post( api.DELETE_VOUCHER
        , { voucherId: id }
        , {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setVouchers(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
        onCloseModal();
    }

    const onCloseModal = async () => {
        setId(null);
        setVoucher(null);
        onClose();  
    }

    React.useEffect(() => {
        if (!id) return;
        getVoucher();
    }, [id]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View voucher details</ModalHeader>
                
                <ModalCloseButton />
                
                <ModalBody>
                    {voucher ? <Stack spacing={3}>
                        {/* View Items modal */}
                        <Button onClick={viewItem}>View items</Button>
                        <ViewItemByVouModal data={items} setData={setItems} />

                        {/* Form */}
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input 
                                type="text" value={voucher.name} 
                                onChange={(e) => setVoucher({ ...voucher, name: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input 
                                type="text" value={voucher.description} 
                                onChange={(e) => setVoucher({ ...voucher, description: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Discount</FormLabel>
                            <Input 
                                type="number" value={voucher.discount} 
                                onChange={(e) => setVoucher({ ...voucher, discount: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Amount</FormLabel>
                            <Input 
                                type="number" value={voucher.amount} 
                                onChange={(e) => setVoucher({ ...voucher, amount: e.target.value })} 
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Used</FormLabel>
                            <Input 
                                type="number" value={voucher.used} 
                                onChange={(e) => setVoucher({ ...voucher, used: e.target.value })} 
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Start date</FormLabel>
                            <Input 
                                type="date" value={voucher.startDate} 
                                onChange={(e) => setVoucher({ ...voucher, startDate: new Date(e.target.value) })} 
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>End date</FormLabel>
                            <Input 
                                type="date" value={voucher.endDate} 
                                onChange={(e) => setVoucher({ ...voucher, endDate: new Date(e.target.value) })} 
                            />
                        </FormControl>

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
