import {
    useDisclosure,
    Modal, FormControl, Input,
    ModalOverlay, FormLabel,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button, Box, 
    Spinner, Select,
    Stack
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import api from '../../../apis';
import { message, Divider, Popconfirm } from 'antd';

const ROLES = [
    'Owner',
    'Admin',
    'Moderator',
    'Editor',
]

export default function ViewUser({ id, setId, setUsers }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [targetUser, setTargetUser] = React.useState(null);

    const user = useSelector(state => state.auth.user);

    const [selectedRole, setSelectedRole] = React.useState(null);

    const getUser = async () => {
        onOpen();
        await axios.post(
            api.GET_USER
            , { targetId: id }
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                }
            }
        ).then(res => {
            setTargetUser(res.data.metadata);
            message.success(res.data.message);
            setSelectedRole(res.data.metadata.role)
        }).catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        });
    };

    const onSave = async () => {
        setLoading(true);
        await axios.post(api.CHANGE_USER_ROLE, {
            targetUser: targetUser
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        }).then(res => {
            message.success(res.data.message);
            setUsers(res.data.metadata);
            onCloseModal();
        }).catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    }

    const onCloseModal = async () => {
        setId(null);
        setTargetUser(null);
        onClose();  
    }

    React.useEffect(() => {
        if (!id) return;
        getUser();
    }, [id]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {targetUser ? 
                    <Stack>
                        <Divider orientation='left'>User Information</Divider>
                            
                            <Box border={'solid black'} borderRadius={10} padding={4}>
                                <label>Name:</label>
                                <Box color='green'>{targetUser._id.name}</Box>
                            </Box>                        
                            <Box border={'solid black'} borderRadius={10} padding={4} marginBottom={5}>
                                <label>Email:</label>
                                <Box color='green'>{targetUser._id.email}</Box>
                            </Box>
                            
                        <Divider orientation='left'>Add By Information</Divider>
                            <Box border={'solid black'} borderRadius={10} padding={4}>
                                <label>Add By Name:</label>
                                <Box color='green'>{targetUser.addBy.name}</Box>
                            </Box>
                            <Box border={'solid black'} borderRadius={10} padding={4} marginBottom={5}>
                                <label>Add By Email:</label>
                                <Box color='green'>{targetUser.addBy.email}</Box>
                            </Box>

                        <Divider orientation='left'>Other Information</Divider>
                            <Box border={'solid black'} borderRadius={10} padding={4} marginBottom={5}>
                                <label>Account is add at:</label>
                                <Box color='green'>{new Date(targetUser.createdAt).toLocaleDateString()}</Box>
                            </Box>

                        <Divider orientation='left'>Change Role</Divider>
                            <Popconfirm
                                title="Are you sure you want to change the role?"
                                onConfirm={() => setTargetUser({...targetUser, role: selectedRole})}
                                okText="Yes"
                                cancelText="No"
                                overlayStyle={{ zIndex: 3000 }}
                            >
                                
                                <Select 
                                   
                                    value={selectedRole} 
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    {Array
                                        .from({length: 4 - user?.role}, (_, i) => user?.role + i + 1)
                                        .map(role => 
                                            <option key={role} value={role}>{ROLES[role - 1]}</option>
                                    )}
                                </Select>
                        </Popconfirm>
                    </Stack> : <Spinner />}
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={onCloseModal}
                        isLoading={loading}
                    >
                        Close
                    </Button>
                    <Button
                        colorScheme="green"
                        onClick={onSave}
                        type="submit"
                        isLoading={loading}
                        loadingText="Saving..."
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
