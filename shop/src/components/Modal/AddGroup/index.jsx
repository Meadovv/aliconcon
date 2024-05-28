import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

function AddGroupModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
    });

    const handleSubmit = async () => {
        setLoading(true);
        await axios.post(api.ADD_GROUP, form, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client'),
            },
        })
        .then(res => {
          message.success(res.data.message);
        })
        .catch(err => {
          console.log(err);
          message.error(err.response.data.message);
        })
        setLoading(false)
        onCloseModal();
    };

    const onCloseModal = () => {
        setForm({
            name: '',
        });
        onClose();
    };

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

            <Modal isOpen={isOpen} onClose={onCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Group Name</FormLabel>
                            <Input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                placeholder="Group Name"
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
                            Add
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

export default AddGroupModal;
