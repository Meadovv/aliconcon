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
    Select,
    Flex,
    Box,
    Image,
    List,
    ListItem,
    HStack,
    VStack,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import api, { IMAGE_HOST } from '../../../apis';
import { useNavigate } from 'react-router-dom';

import MediaViewModal from '../MediaView';
import AddVariantModal from '../AddVariant';

export default function AddProductModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const { user, shop } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [product, setProduct] = React.useState({
        name: "",
        short_description: "",
        description: "",
        category: "",
        price: 0,
        thumbnail: "",
        variations: [],
    });

    const getCategories = async () => {
        await axios
            .get(api.GET_CATEGORIES + `?shopId=${shop._id}`)
            .then((res) => {
                setCategories(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    const setProductImage = (image) => {
        setProduct({ ...product, thumbnail: image });
    };

    const handleAddVariant = (variant) => {
        setProduct({ ...product, variations: [...product.variations, variant] });
    }

    const onSave = async () => {
        await axios
            .post(
                api.ADD_PRODUCT,
                {
                    ...product,
                    thumbnail: product.thumbnail._id,
                },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    }
                },
            )
            .then((res) => {
                message.success('Product added successfully');
                onClose();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    const handleRemoveVariation = (index) => {
        const variations = product.variations;
        variations.splice(index, 1);
        setProduct({ ...product, variations });
    };

    React.useEffect(() => {
        if (shop) getCategories();
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
                            <Input
                                type="text"
                                placeholder="Product Name"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Short Description</FormLabel>
                            <Input
                                type="text"
                                placeholder="Short Description"
                                value={product.short_description}
                                onChange={(e) => setProduct({ ...product, short_description: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Product Description"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Category</FormLabel>
                            <Select
                                placeholder="Select category"
                                value={product.category}
                                onChange={(e) => {
                                    if (e.target.value === 'other') {
                                        navigate('/categories');
                                    } else {
                                        setProduct({ ...product, category: e.target.value });
                                    }
                                }}
                            >
                                <option
                                    value="other"
                                    style={{
                                        color: 'blue',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Add Category
                                </option>
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
                                <Input type="number" placeholder="Price" value={product.price} onChange={(e) => setProduct({...product, price: e.target.value})}/>
                                <InputRightAddon children="VND" />
                            </InputGroup>
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Variations</FormLabel>
                            <VStack
                                align="stretch"
                                border={'1px solid black'}
                                borderColor={'gray.200'}
                                borderRadius={'md'}
                                p={4}
                                mb={3}
                            >
                                {product.variations.length ? product.variations.map((variation, index) => (
                                    <HStack key={index} justify="space-between">
                                        <Box>
                                            <Text fontWeight="bold">{variation.name}</Text>
                                            <HStack spacing={3}>
                                                {variation.options.map((option, i) => (
                                                    <Box key={i} borderWidth={1} borderRadius="md" p={2}>
                                                        {option}
                                                    </Box>
                                                ))}
                                            </HStack>
                                        </Box>
                                        <Button colorScheme="red" onClick={handleRemoveVariation}>
                                            Remove
                                        </Button>
                                    </HStack>
                                )) : <Text>No variations added</Text>}
                            </VStack>
                            <AddVariantModal handleAddVariant={handleAddVariant} />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Thumbnail</FormLabel>
                            {product.thumbnail ? (
                                <Flex gap={3}>
                                    <Box>
                                        <Image
                                            src={IMAGE_HOST.THUMBNAIL(product.thumbnail.name)}
                                            alt={'Media content'}
                                        />
                                    </Box>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => setProduct({ ...product, thumbnail: null })}
                                    >
                                        Remove
                                    </Button>
                                </Flex>
                            ) : (
                                <MediaViewModal setImage={setProductImage} />
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
