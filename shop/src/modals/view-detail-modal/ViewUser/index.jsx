import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    Button,
    Spinner,
    Stack
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

import api from '../../../apis';
import { message, Select, Divider, Popconfirm } from 'antd';

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
        await axios.post(api.GET_USER, { targetId: id }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        }).then(res => {
            setTargetUser(res.data.metadata);
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
        setSelectedRole(targetUser.role);
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
                        <div>Name: {targetUser._id.name}</div>
                        <div>Email: {targetUser._id.email}</div>
                        <Divider orientation='left'>Add By Information</Divider>
                        <div>Add By Name: {targetUser.addBy.name}</div>
                        <div>Add By Email: {targetUser.addBy.email}</div>
                        <Divider orientation='left'>Other Information</Divider>
                        <div>Account is add at: {new Date(targetUser.createdAt).toLocaleDateString()}</div>
                        <Divider orientation='left'>Change Role</Divider>
                        <Popconfirm
                            title="Are you sure you want to change the role?"
                            onConfirm={() => setTargetUser({...targetUser, role: selectedRole})}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Select 
                                value={selectedRole} 
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                {Array
                                    .from({length: 4 - user?.role}, (_, i) => user?.role + i + 1)
                                    .map(role => 
                                        <Select.Option key={role} value={role}>{ROLES[role - 1]}</Select.Option>
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
