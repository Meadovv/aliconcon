import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { message } from 'antd';
import axios from 'axios';
import api from '../../apis';

import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SetPassword() {
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [newToken, setNewToken] = React.useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = React.useState(0);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
        } else {
            await axios
                .post(api.PASSWORD_RESET, { token: newToken, password })
                .then((res) => {
                    message.success(res.data.message);
                    navigate('/authentication');
                })
                .catch((err) => {
                    console.log(err);
                    message.error(err.response.data.message);
                });
        }
        setLoading(false);
    };

    const checkToken = async ({ key, email }) => {
        await axios
            .post(api.CHECK_TOKEN, { token: key, email })
            .then((res) => {
                setNewToken(res.data.metadata);
            })
            .catch((err) => {
                setError(1);
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    React.useEffect(() => {
        const key = searchParams.get('key');
        const email = searchParams.get('email');
        if (!key || !email) {
            message.error('Invalid reset password link');
        } else {
            checkToken({ key, email });
        }
    }, []);

    return error ? (
        <div>
            Something went wrong!
        </div>
    ) : (
        <Box maxW="sm" mx="auto" mt="10">
            <VStack spacing={4}>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </FormControl>
                <FormControl id="confirm-password">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                </FormControl>
                <Button colorScheme="blue" width="full" onClick={handleSubmit} isLoading={loading}>
                    Set Password
                </Button>
            </VStack>
        </Box>
    );
}
