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

import { useSelector, useDispatch } from 'react-redux';

import { closeModal } from '../../../reducer/actions/modal.slice';

function LoginModal() {
    const { onClose } = useDisclosure();
    const modal = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (modal.login) onOpenModal();
        else onCloseModal();
    }, [modal]);

    const onCloseModal = () => {
        dispatch(closeModal({ modal: 'login' }));
        onClose();
    }

    const onOpenModal = () => {

    }

    return (
        <>
            <Modal className='modal' isOpen={modal.login} onClose={onCloseModal} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder="Enter your password" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onCloseModal}>
                            Login
                        </Button>
                        <Button variant="ghost" onClick={onCloseModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default LoginModal;
