import {
    useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, Stack,
    ModalBody, ModalFooter, ModalCloseButton, Button, Spinner, Input
} from '@chakra-ui/react';

import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';

export default function ViewGroup({ group, setGroup, setGroups }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);

    const onSave = async () => {
        setLoading(true);
        await axios.post(api.UPDATE_GROUP
            , {groupId: id, name: group.name}
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token')
                }
        }).then(res => {
            message.success(res.data.message);
            setGroups(res.data.metadata);
            onCloseModal();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    const onDelete = async () => {
        setLoading(true);
        await axios.post( api.DELETE_GROUP
            , { groupId: id }
            , {
                headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
                }
            }
        ).then(res => {
            message.success(res.data.message);
            setGroups(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
        onCloseModal();
    }

    const onCloseModal = async () => {
        setGroup({
            id: null,
            name: null,
        });
        onClose();  
    }

    React.useEffect(() => {
        if (!group.id) return;
        onOpen();
    }, [group]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {group ? 
                    <Stack>
                        <label>Name</label>
                        <Input
                            value={group.name} 
                            onChange={(e) => {setGroup({...group, name: e.target.value})}}
                        />
                    </Stack>: <Spinner />}
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
                        colorScheme="red"
                        mr={3}
                        onClick={onDelete}
                        isLoading={loading}
                    >
                        Delete
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
