import { AddIcon } from '@chakra-ui/icons';
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
    InputGroup,
    InputRightAddon,
    Textarea,
    Select
} from '@chakra-ui/react';
import React from 'react';

import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import api from '../../../apis';
import { useNavigate } from 'react-router-dom';

export default function AddProductModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const { user, shop } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const getCategories = async () => {
        await axios.get(api.GET_CATEGORIES + `?shopId=${shop._id}`).then(res => {
            setCategories(res.data.metadata);
        }).catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        });
    };

    React.useEffect(() => {
        if(shop) getCategories();
    }, [shop]);

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
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" placeholder="Product Name" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Short Description</FormLabel>
                            <Input type="text" placeholder="Short Description" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder="Product Description" />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Category</FormLabel>
                            <Select placeholder="Select category" onChange={(e) => {
                                if(e.target.value === 'other') {
                                    navigate('/categories');
                                } else {

                                }
                            }}>
                                <option value="other" style={{
                                    color: 'blue',
                                    fontWeight: 'bold'
                                }}>Add Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Price</FormLabel>
                            <InputGroup>
                                <Input type="number" placeholder="Price" />
                                <InputRightAddon children="VND" />
                            </InputGroup>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Thumbnail</FormLabel>
                            <Input type="text" placeholder="Thumbnail URL" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
