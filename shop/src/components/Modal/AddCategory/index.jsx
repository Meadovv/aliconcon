import { 
    Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input
} from '@chakra-ui/react';

import { AddIcon } from '@chakra-ui/icons';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function AddCategoryModal({ setCategories }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [form, setForm] = React.useState({
        name: null,
    });
    const [loading, setLoading] = React.useState(false);

    const onAdd = async () => {
        setLoading(true);
        await axios.post(api.CREATE_CATEGORY, form, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token')
            }
        }).then(res => {
            message.success(res.data.message);
            setCategories(res.data.metadata);
            onClose();
        }).catch(err => {
            console.log(err)
            message.error(err.response.data.message);
        })
        setLoading(false);
    }

    return (
        <>
            {/*Always on*/}
            <Button
                bg={'green.400'}
                color={'white'}
                _hover={{
                    bg: 'green.500',
                }}
                leftIcon={<AddIcon />}
                onClick={onOpen}
            >
                Add new Category
            </Button>
            {/*On when isOpen on*/}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input type="text" placeholder="Category Name" onChange={(e) => setForm({...form, name: e.target.value})}/>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} 
                            isLoading={loading}
                            loadingText='Closing...'
                            onClick={() => {
                                setForm({
                                    name: null,
                                });
                                onClose();
                            }}
                        > 
                        Close
                        </Button>
                        <Button 
                            colorScheme="green" onClick={onAdd} 
                            type='submit' 
                            isLoading={loading} 
                            loadingText='Adding...'
                        > Add 
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
