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
    Input,
    Stack
} from '@chakra-ui/react';
import React from 'react';
import axios from 'axios';

import api from '../../../apis';
import { message } from 'antd';

export default function ViewCategory({ id, setId, setCategories }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = React.useState(false);
    const [category, setCategory] = React.useState(null);

    const getCategory = async () => {
        onOpen();
        await axios.post(api.GET_CATEGORY, { categoryId: id }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            setCategory(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
    };

    React.useEffect(() => {
        if (!id) return;
        getCategory();
    }, [id]);

    const onSave = async () => {
        setLoading(true);
        await axios.post(api.UPDATE_CATEGORY, {
            category: category
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setCategories(res.data.metadata);
            onCloseModal();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    const onDelete = async () => {
        setLoading(true);
        await axios.post(api.DELETE_CATEGORY, { categoryId: id }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setCategories(res.data.metadata);
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
        onCloseModal();
    }

    const onCloseModal = async () => {
        setId(null);
        setCategory(null);
        onClose();  
    }

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>View Category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {category ? 
                    <Stack>
                        <label>Name</label>
                        <Input value={category.name} onChange={(e) => {
                            if(category.status === 'draft') {
                                setCategory({...category, name: e.target.value})
                            } else {
                                message.error('Cannot edit published category');
                            }
                        }}/>
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
