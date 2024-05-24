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
    Input
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function AddProductModal({ setProducts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = React.useState({
        name: null,
        thumbnail: null,
        short_description: null,
        price: null,
        category: null,
    });
    const [loading, setLoading] = React.useState(false);

    const onAdd = async () => {
        setLoading(true);
        await axios.post(api.CREATE_PRODUCT, form, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
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
                Add
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" placeholder="Product Name" onChange={(e) => setForm({...form, name: e.target.value})}/>
                            <FormLabel>Thumbnail</FormLabel>
                            <Input type="text" placeholder="Product Thumbnail (link to image)" onChange={(e) => setForm({...form, thumbnail: e.target.value})}/>
                            <FormLabel>Price</FormLabel>
                            <Input type="number" placeholder="Product Price" onChange={(e) => setForm({...form, price: e.target.value})}/>
                            <FormLabel>Short description</FormLabel>
                            <Input type="text" placeholder="Short description" onChange={(e) => setForm({...form, short_description: e.target.value})}/>
                            <FormLabel>Category</FormLabel>
                            <Input/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            setForm({
                                name: null,
                                thumbnail: null,
                                short_description: null,
                                price: null,
                                category: null,
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
