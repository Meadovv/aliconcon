import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
    Button, Flex, Input, Box, useDisclosure, ModalCloseButton,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Spinner from '../../../components/Spinner';
import api from '../../../apis';
import { message } from 'antd';
import { useSelector } from 'react-redux';

export default function AddProductToGroupModal({ groupId, resetProdByGroup }) {

    const user = useSelector((state) => state.auth.user);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([])

    {/* Data function */}
    const getProducts = async () => {
        setLoading(true);
        await axios.post(
            api.GET_PRODUCTS
            ,{}
            ,{
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                },
            },
        )
        .then((res) => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    {/* Search functions */}
    const handleSearchInputChange = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearchQuery(query);

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredProducts);
        setLoading(false);
    };

    const handleSearchResultClick = async (productId) => {
        setLoading(true);
        await axios.post(
            api.ADD_PRODUCT_TO_GROUP,
            { groupId, productId },
            {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                },
            }
        )
        .then((res) => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
            resetProdByGroup();
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };
    
    {/* Use effects */}
    useEffect(() => {
        if(!groupId) return;
        getProducts();
    }, [groupId]);

    return (
        <>
            <Button
                isDisabled={user && user.role > 3}
                bg={'green.400'}
                color={'white'}
                _hover={{
                    bg: 'green.500',
                }}
                leftIcon={<AddIcon />}
                onClick={onOpen}
            >
                Add product to the group
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add product to this group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" gap={4}>
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                isDisabled={loading}
                                isLoading={loading}
                            />
                            {loading && <Spinner />}
                            {searchResults.length > 0 && searchQuery && (
                                <Box bg="white" boxShadow="md" rounded="md" mt={2} p={2} maxHeight="200px" overflowY="auto">
                                    {searchResults.map(product => (
                                        <Box
                                            key={product._id}
                                            p={2}
                                            borderBottom="1px solid"
                                            borderColor="gray.200"
                                            cursor="pointer"
                                            onClick={() => handleSearchResultClick(product._id)}
                                        >
                                            {product.name}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            colorScheme="blue" mr={3} 
                            isLoading={loading}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
