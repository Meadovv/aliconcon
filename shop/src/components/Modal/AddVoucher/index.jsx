import { 
    Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, Select, Stack, 
    ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Box, IconButton, 
} from '@chakra-ui/react';

import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function AddVoucherModal({ setVouchers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = React.useState({
        name: '',
        description: '',
        discount: 0,
        price: 0,
        startDate: '',
        endDate: '',
        amount: 0,
    });
    const [loading, setLoading] = React.useState(false);

    const onAdd = async () => {
        setLoading(true);
        await axios.post( api.CREATE_VOUCHER
            , form
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token')
                }
            }
        ).then(res => {
            message.success(res.data.message);
            setVouchers(res.data.metadata);
            onClose();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    return (
        <>
            {/*The add button*/}
            <Button
                bg={'green.400'}
                color={'white'}
                _hover={{
                    bg: 'green.500',
                }}
                leftIcon={<AddIcon />}
                onClick={onOpen}
            >
                Add new voucher
            </Button>

            {/*The modal shown when isOpen */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add voucher</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={3}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input type="text" placeholder="Voucher Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Long description</FormLabel>
                                <Input type="text" placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Price</FormLabel>
                                <Input type="number" placeholder="Voucher Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Discount</FormLabel>
                                <Input type="number" placeholder="Voucher Discount" onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Start date</FormLabel>
                                <Input type="number" placeholder="Voucher Start date" onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>End date</FormLabel>
                                <Input type="number" placeholder="Voucher End date" onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <Input type="number" placeholder="Voucher Amount" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            isLoading={loading}
                            colorScheme="blue" mr={3} onClick={() => {
                                setForm({
                                    name: null,
                                    description: null,
                                    discount: null,
                                    price: null,
                                    startDate: null,
                                    endDate: null,
                                    amount: null,
                                });
                                onClose();
                            }} 
                        >
                            Close
                        </Button>
                        <Button 
                            colorScheme="green" onClick={onAdd} 
                            type='submit' isLoading={loading} 
                            loadingText='Adding...'
                        >
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
