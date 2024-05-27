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
    Box,
    IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function AddProductModal({ setProducts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = React.useState({
        name: '',
        thumbnail: '',
        short_description: '',
        price: '',
        category: '',
        variations: []
    });
    const [loading, setLoading] = React.useState(false);

    const handleAddVariation = () => {
        setForm(prevForm => ({
            ...prevForm,
            variations: [...prevForm.variations, { name: '', options: [''] }]
        }));
    };

    const handleRemoveVariation = (index) => {
        setForm(prevForm => ({
            ...prevForm,
            variations: prevForm.variations.filter((_, i) => i !== index)
        }));
    };

    const handleVariationChange = (index, field, value) => {
        const newVariations = [...form.variations];
        newVariations[index][field] = value;
        setForm({ ...form, variations: newVariations });
    };

    const handleOptionChange = (varIndex, optionIndex, value) => {
        const newVariations = [...form.variations];
        newVariations[varIndex].options[optionIndex] = value;
        setForm({ ...form, variations: newVariations });
    };

    const handleAddOption = (varIndex) => {
        const newVariations = [...form.variations];
        newVariations[varIndex].options.push('');
        setForm({ ...form, variations: newVariations });
    };

    const handleRemoveOption = (varIndex, optionIndex) => {
        const newVariations = [...form.variations];
        newVariations[varIndex].options = newVariations[varIndex].options.filter((_, i) => i !== optionIndex);
        setForm({ ...form, variations: newVariations });
    };

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
        });
        setLoading(false);
    };

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
                Add new product
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Product</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" placeholder="Product Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <FormLabel>Long description</FormLabel>
                            <Input type="text" placeholder="Long description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            <FormLabel>Short description</FormLabel>
                            <Input type="text" placeholder="Short description" onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
                            <FormLabel>Category</FormLabel>
                            <Input type="text" placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
                            <FormLabel>Price</FormLabel>
                            <Input type="number" placeholder="Product Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
                            <FormLabel>Thumbnail</FormLabel>
                            <Input type="text" placeholder="Product Thumbnail (link to image)" onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
                            <FormLabel>Variations</FormLabel>
                            {form.variations.map((variation, varIndex) => (
                                <Box key={varIndex} mb={4} border="1px solid #ccc" p={3} borderRadius={5}>
                                    <FormLabel>Variation {varIndex + 1} Name</FormLabel>
                                    <Input type="text" placeholder="Variation Name" value={variation.name} onChange={(e) => handleVariationChange(varIndex, 'name', e.target.value)} />
                                    <FormLabel>Options</FormLabel>
                                    {variation.options.map((option, optionIndex) => (
                                        <Box key={optionIndex} mb={2} display="flex" alignItems="center">
                                            <Input type="text" placeholder="Option" value={option} onChange={(e) => handleOptionChange(varIndex, optionIndex, e.target.value)} />
                                            <IconButton icon={<DeleteIcon />} colorScheme="red" ml={2} onClick={() => handleRemoveOption(varIndex, optionIndex)} />
                                        </Box>
                                    ))}
                                    <Button colorScheme="blue" onClick={() => handleAddOption(varIndex)}>Add Option</Button>
                                    <IconButton icon={<DeleteIcon />} colorScheme="red" ml={2} onClick={() => handleRemoveVariation(varIndex)} />
                                </Box>
                            ))}
                            <Button colorScheme="blue" onClick={handleAddVariation}>Add Variation Tier</Button>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            setForm({
                                name: '',
                                thumbnail: '',
                                short_description: '',
                                price: '',
                                category: '',
                                variations: []
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
