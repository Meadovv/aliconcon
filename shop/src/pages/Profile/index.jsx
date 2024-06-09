import React, { useState, useEffect } from 'react';
import { Flex, Box, Text, Heading, VStack, HStack, Divider } from '@chakra-ui/react';
import Spinner from '../../components/Spinner';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../apis';
import { message } from 'antd';

export default function Profile() {
    const [shopInfo, setShopInfo] = useState(null);
    
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.auth.user);
    const shop = useSelector((state) => state.auth.shop);

    const getShopInfo = async () => {
        await axios
            .get(api.GET_SHOP, { params: { shopId: shop._id } })
            .then((res) => {
                message.success(res.data.message);
                setShopInfo(res.data.metadata);
                console.log(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    useEffect(() => {
        setLoading(true);
        getShopInfo();
        console.log(shopInfo);
    }, [shop, user]);

    useEffect(() => {
        if(shopInfo) {
            console.log(shopInfo);
            setLoading(false);
        }
    }, [shopInfo]);

    if (loading) {
        return (
            <Flex justify="center" align="center" height="100vh">
                <Spinner/>
            </Flex>
        );
    }

    return (
        <Flex direction="column" p={8} bg="gray.50" rounded="lg" boxShadow="lg">
            <Box bg="white" p={6} rounded="lg" boxShadow="md">
                <Heading as="h3" size="lg" mb={4} textAlign="center">
                    Shop Profile
                </Heading>
                <VStack spacing={4} align="start">
                    <HStack>
                        <Text fontWeight="bold">Shop ID:</Text>
                        <Text>{shopInfo._id}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Name:</Text>
                        <Text>{shop.name}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Email:</Text>
                        <Text>{shopInfo.email}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Phone:</Text>
                        <Text>{shopInfo.phone}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Address:</Text>
                        <Text>{shopInfo.address}</Text>
                    </HStack>
                </VStack>
            </Box>

            <Divider my={8} />

            <Box bg="white" p={6} rounded="lg" boxShadow="md">
                <Heading as="h3" size="lg" mb={4} textAlign="center">
                    User Profile
                </Heading>
                <VStack spacing={4} align="start">
                    <HStack>
                        <Text fontWeight="bold">User ID:</Text>
                        <Text>{user._id}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Name:</Text>
                        <Text>{user.name}</Text>
                    </HStack>
                    <HStack>
                        <Text fontWeight="bold">Email:</Text>
                        <Text>{user.email}</Text>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
};

