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
    Input, Box, IconButton, 
    Stack, FormControl, FormLabel
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message, Select } from 'antd';

export default function ViewProduct({ id, setId, setProducts }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const [categories, setCategories] = React.useState([]);

    const handleAddVariation = () => {
        setProduct(prevForm => ({
            ...prevForm,
            variations: [...prevForm.variations, { name: '', options: [''] }]
        }));
    };

    const handleRemoveVariation = (index) => {
        setProduct(prevForm => ({
            ...prevForm,
            variations: prevForm.variations.filter((_, i) => i !== index)
        }));
    };

    const handleVariationChange = (index, field, value) => {
        const newVariations = [...product.variations];
        newVariations[index][field] = value;
        setProduct({ ...product, variations: newVariations });
    };

    const handleOptionChange = (varIndex, optionIndex, value) => {
        const newVariations = [...product.variations];
        newVariations[varIndex].options[optionIndex] = value;
        setProduct({ ...product, variations: newVariations });
    };

    const handleAddOption = (varIndex) => {
        const newVariations = [...product.variations];
        newVariations[varIndex].options.push('');
        setProduct({ ...product, variations: newVariations });
    };

    const handleRemoveOption = (varIndex, optionIndex) => {
        const newVariations = [...product.variations];
        newVariations[varIndex].options = newVariations[varIndex].options.filter((_, i) => i !== optionIndex);
        setProduct({ ...product, variations: newVariations });
    };

    const getProduct = async () => {
        onOpen();
        setLoading(true);
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
        setLoading(false);
    };

    const getCategories = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_CATEGORIES,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setCategories(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const onSave = async () => {
        setLoading(true);
        await axios.post( 
            api.UPDATE_PRODUCT
            , { product: product }
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token')
                }
            }
        ).then(res => {
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
        await axios.post( 
            api.DELETE_PRODUCT
            , { productId: id }
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token')
                }
            }
        ).then(res => {
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

    React.useEffect(() => {
        if (!id) return;
        getProduct();
    }, [id]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View product</ModalHeader>
                
                <ModalCloseButton />
                
                <ModalBody>
                    {product ? <Stack spacing={3}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input 
                                type="text" value={product.name} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Long description</FormLabel>
                            <Input 
                                type="text" value={product.description} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Short description</FormLabel>
                            <Input 
                                type="text" value={product.short_description} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, short_description: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select 
                                value={product.category} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                            >
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}> {category.name} </option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input 
                                type="number" value={product.price} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })} 
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Thumbnail</FormLabel>
                            <Input 
                                type="text" value={product.thumbnail} isDisabled={product && product.status === 'published'}
                                onChange={(e) => setProduct({ ...product, thumbnail: e.target.value })} />
                        </FormControl>
                        {/* Variations form */}
                        <FormControl>
                            <FormLabel>Variations</FormLabel>
                            {product.variations.map((variation, varIndex) => (
                                <Box key={varIndex} mb={4} border="1px solid #ccc" p={3} borderRadius={5}>
                                    <FormLabel>Variation {varIndex + 1} Name</FormLabel>
                                    <Input 
                                        type="text" value={variation.name} 
                                        onChange={(e) => handleVariationChange(varIndex, 'name', e.target.value)} 
                                        isDisabled={product && product.status === 'published'}
                                    />
                                    <FormLabel>Options</FormLabel>
                                    {variation.options.map((option, optionIndex) => (
                                        <Box key={optionIndex} mb={2} display="flex" alignItems="center">
                                            <Input 
                                                type="text" value={option} 
                                                onChange={(e) => handleOptionChange(varIndex, optionIndex, e.target.value)} 
                                                isDisabled={product && product.status === 'published'}
                                            />
                                            <IconButton 
                                                icon={<DeleteIcon />} colorScheme="red" ml={2} 
                                                onClick={() => handleRemoveOption(varIndex, optionIndex)} 
                                                isDisabled={product && product.status === 'published'}
                                            />
                                        </Box>
                                    ))}
                                    <Button 
                                        colorScheme="blue" mt={0} onClick={() => handleAddOption(varIndex)}
                                        isDisabled={product && product.status === 'published'}
                                    >
                                        Add Option
                                    </Button>
                                    <Button 
                                        colorScheme="red" ml={24} mt={0} onClick={() => handleRemoveVariation(varIndex)}
                                        isDisabled={product && product.status === 'published'}
                                    >
                                        Remove Variation
                                    </Button>
                                </Box>
                            ))}
                            <Button 
                                isDisabled={product && product.status === 'published'}
                                colorScheme="blue" onClick={handleAddVariation}
                            >
                                Add Variation
                            </Button>
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
