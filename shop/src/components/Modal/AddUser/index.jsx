import {
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import React from 'react';

import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../../apis';
import {
    message
} from 'antd';

const ROLES = [
    'Owner',
    'Admin',
    'Moderator',
    'Editor',
]

export default function AddUserModal({ setUsers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [form, setForm] = React.useState({
        email: null,
        role: null
    })
    const user = useSelector(state => state.auth.user);

    const onAdd = async () => {
        await axios.post(api.ADD_USER, {
            targetEmail: form.email,
            targetRole: Number(form.role)
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setUsers(res.data.metadata);
            onClose();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
    }

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
                Add user
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" onChange={(e) => setForm({...form, email: e.target.value})}/>
                        </FormControl>
                        <FormControl id="role" mt={4}>
                            <FormLabel>Role</FormLabel>
                            <Select placeholder="Select role" onChange={(e) => setForm({...form, role: e.target.value})}>
                            {Array.from({length: 4 - user?.role}, (_, i) => user?.role + i + 1).map(role => 
                                <option key={role} value={role}>{ROLES[role - 1]}</option>
                            )}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            setForm({
                                email: null,
                                role: null
                            });
                            onClose();
                        }}>
                            Close
                        </Button>
                        <Button colorScheme="green" onClick={onAdd} type='submit'>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
