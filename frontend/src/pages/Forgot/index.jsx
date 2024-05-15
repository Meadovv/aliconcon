import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { message } from 'antd';

import axios from 'axios';
import api from '../../apis';

export default function ForgotPassword() {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        if(!email) return message.error('Please enter your email');
        await axios.post(api.FORGOT_PASSWORD, { email })
        .then(res => {
            message.success(res.data.message);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    return (
        <Box maxW="sm" mx="auto" mt="10">
            <VStack spacing={4}>
                <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </FormControl>
                <Button colorScheme="blue" width="full" onClick={handleSubmit} isLoading={loading} loadingText='Sending'>
                    Send Password Reset Email
                </Button>
            </VStack>
        </Box>
    );
}