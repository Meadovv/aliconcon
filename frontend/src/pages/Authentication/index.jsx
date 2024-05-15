import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Center, VStack, FormControl, FormLabel, Input, Button, Box, Heading } from '@chakra-ui/react';

import { message } from 'antd';
import axios from 'axios';
import api from '../../apis';

export default function Authentication() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if (localStorage.getItem('token') && localStorage.getItem('client')) navigate('/');
    }, [navigate]);

    const [mode, setMode] = React.useState('register');
    const [loginData, setLoginData] = React.useState({ email: '', password: '' });
    const [registerData, setRegisterData] = React.useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
    });

    const handleLoginChange = (e) => {
        const { id, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleRegisterChange = (e) => {
        const { id, value } = e.target;
        setRegisterData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleLogin = async () => {
        setLoading(true);
        await axios.post(api.LOGIN, loginData)
            .then((response) => {
                message.success(response.data.message);
                localStorage.setItem('token', response.data.metadata.token);
                localStorage.setItem('client', response.data.metadata.user._id);
                window.location.reload();
                onCloseModal();
            })
            .catch((error) => {
                console.log(error);
                message.error(error.response.data.message);
            });
        setLoading(false);
    };

    const handleRegister = async () => {
        setLoading(true);
        await axios.post(api.REGISTER, registerData)
            .then((response) => {
                message.success(response.data.message);
                localStorage.setItem('token', response.data.metadata.token);
                localStorage.setItem('client', response.data.metadata.user._id);
                window.location.reload();
                onCloseModal();
            })
            .catch((error) => {
                console.log(error);
                message.error(error.response.data.message);
            });
        setLoading(false);
    };

    const LoginForm = (
        <VStack spacing={4} p={8} boxShadow="md" borderRadius="md" bg="white">
            <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                />
            </FormControl>
            <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                />
            </FormControl>
            <FormControl id="password">
                <div style={{
                    fontSize: '14px',
                    color: 'blue',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                }} onClick={() => navigate('/forgot-password')}>Forgot Password</div>
            </FormControl>
            <Button colorScheme="blue" width="full" onClick={handleLogin}>
                Login
            </Button>
            <Button variant="link" onClick={() => setMode('register')} isLoading={loading}>
                Switch to Register
            </Button>
        </VStack>
    );

    const RegisterForm = (
        <VStack spacing={4} p={8} boxShadow="md" borderRadius="md" bg="white">
            <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter your name" value={registerData.name} onChange={handleRegisterChange} />
            </FormControl>
            <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                />
            </FormControl>
            <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                />
            </FormControl>
            <FormControl id="address">
                <FormLabel>Address</FormLabel>
                <Input placeholder="Enter your address" value={registerData.address} onChange={handleRegisterChange} />
            </FormControl>
            <FormControl id="phone">
                <FormLabel>Phone Number</FormLabel>
                <Input
                    placeholder="Enter your phone number"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                />
            </FormControl>
            <Button colorScheme="blue" width="full" onClick={handleRegister} isLoading={loading}>
                Register
            </Button>
            <Button variant="link" onClick={() => setMode('login')}>
                Switch to Login
            </Button>
        </VStack>
    );

    return (
        <Center minH="100vh" bg="gray.50">
            <Box maxW="sm" w="full">
                <Heading as="h1" size="lg" mb={6} textAlign="center">
                    {mode === 'login' ? 'Login' : 'Register'}
                </Heading>
                {mode === 'login' ? LoginForm : RegisterForm}
            </Box>
        </Center>
    );
}
