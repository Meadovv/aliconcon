import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useDisclosure } from '@chakra-ui/react';

import axios from 'axios';
import api from '../../../apis';

import { message } from 'antd';
import { useDispatch } from 'react-redux';

import { setAuth } from '../../../reducer/actions/auth.slice';

export default function ChangeNameModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const dispatch = useDispatch();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        await axios.post(api.CHANGE_SHOP_NAME, { name }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        })
        .then(res => {
            dispatch(setAuth(res.data.metadata));
            message.success('Name changed successfully');
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
        setLoading(false);
        onClose();
    };

    return (
        <>
            <Button onClick={onOpen} size="sm" >Change</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Name</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input value={name} onChange={handleNameChange} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose} isLoading={loading}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}