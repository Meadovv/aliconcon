import React from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
} from '@chakra-ui/react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { closeModal } from '../../../reducer/actions/modal.slice';
import axios from 'axios';
import api from '../../../apis';

function LoginModal() {
    const { onClose } = useDisclosure();
    const modal = useSelector((state) => state.modal);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const [loginForm, setLoginForm] = React.useState({
        email: '',
        password: '',
    });

    const onCloseModal = () => {
        dispatch(closeModal({ modal: 'login' }));
        onClose();
    };

    const handleLogin = async () => {
        setLoading(true);
        await axios
            .post(api.LOGIN, loginForm)
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

    return (
        <>
            <Modal className="modal" isOpen={modal.login} onClose={onCloseModal} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            />
                        </FormControl>
                        <FormControl id="password">
                            <div
                                style={{
                                    fontSize: '14px',
                                    color: 'blue',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    dispatch(closeModal({ modal: 'login' }));
                                    navigate('/forgot-password');
                                }}
                            >
                                Forgot Password
                            </div>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleLogin} isLoading={loading}>
                            Login
                        </Button>
                        <Button variant="ghost" onClick={onCloseModal} isLoading={loading}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default LoginModal;
