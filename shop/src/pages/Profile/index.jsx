import React from 'react';
import { Box, Heading, HStack, VStack, Text } from '@chakra-ui/react';

import { useSelector } from 'react-redux';
import ChangeNameModal from '../../components/Modal/ChangeName';

export default function Profile() {

    const { user, shop } = useSelector((state) => state.auth);

    const role = (idx) => {
        if (idx === 1) return 'Owner';
        if (idx === 2) return 'Admin';
        if (idx === 3) return 'Moderator';
        if (idx === 4) return 'Editor';
    };

    return (
        <VStack spacing={8} align="stretch">
            <Box p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">Shop Profile</Heading>
                <HStack spacing={4}>
                    <Text>Name: {shop?.name}</Text>
                    {user?.role === 1 && <ChangeNameModal />}
                </HStack>
                <Text>Email: {shop?.email}</Text>
            </Box>
            <Box p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">User Profile</Heading>
                <Text>Name: {user?.name}</Text>
                <Text>Email: {user?.email}</Text>
                <Text>Role: {role(user?.role)}</Text>
            </Box>
        </VStack>
    );
}