import React from 'react';
import { Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';
export default function AddAddressModal({ setAddressList }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [address, setAddress] = React.useState('');
    const [isDefault, setIsDefault] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleIsDefaultChange = (e) => {
        setIsDefault(e.target.checked);
    };

    const handleSubmit = async () => {
        if(!address) return message.error('Address is required!');
        setLoading(true);
        await axios.post(api.ADD_ADDRESS, {
            address: address,
            isDefault: isDefault,
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        })
        .then(res => {
            setAddressList({
                addressList: res.data.metadata.address,
                defaultAddress: res.data.metadata.default_address
            });
            message.success(res.data.message);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
        setLoading(false);
        handleOnClose();
    };

    const handleOnClose = () => {
        onClose();
        setAddress('');
        setIsDefault(false);
    }

    return (
        <>
            <Button onClick={onOpen} colorScheme='red'>Add Address</Button>

            <Modal isOpen={isOpen} onClose={handleOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Address</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Address</FormLabel>
                            <Input value={address} onChange={handleAddressChange} />
                        </FormControl>
                        <Checkbox colorScheme="blue" mt={3} isChecked={isDefault} onChange={handleIsDefaultChange}>
                            Set as default address
                        </Checkbox>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={handleOnClose} isLoading={loading}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}