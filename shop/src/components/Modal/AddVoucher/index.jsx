import {
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Textarea
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function AddVoucherModal({ setVouchers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = React.useState({
        name: null,
        description: null,
        discount: null,
        startDate: new Date(),
        endDate: new Date()
    });
    const [loading, setLoading] = React.useState(false);

    const onAdd = async () => {
        setLoading(true);
        await axios.post(api.CREATE_VOUCHER, form, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setVouchers(res.data.metadata);
            onClose();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    return (
        <>
            <Button
                bg={'green.400'}
                color={'white'}
                _hover={{
                    bg: 'green.500',
                }}
                leftIcon={<AddIcon />}
                onClick={onOpen}
            >
                Add Voucher
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Voucher</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" placeholder="Voucher Name" onChange={(e) => setForm({...form, name: e.target.value})}/>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder="Voucher Description" onChange={(e) => setForm({...form, description: e.target.value})}/>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Discount</FormLabel>
                            <Input type="number" placeholder="Discount" onChange={(e) => setForm({...form, discount: e.target.value})}/>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Start Date</FormLabel>
                            <DatePicker selected={form.startDate} onChange={(date) => setForm({...form, startDate: date})} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>End Date</FormLabel>
                            <DatePicker selected={form.endDate} onChange={(date) => setForm({...form, endDate: date})} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            setForm({
                                name: null,
                                description: null,
                                discount: null,
                                startDate: new Date(),
                                endDate: new Date()
                            });
                            onClose();
                        }} isLoading={loading}>
                            Close
                        </Button>
                        <Button colorScheme="green" onClick={onAdd} type='submit' isLoading={loading} loadingText='Adding...'>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}