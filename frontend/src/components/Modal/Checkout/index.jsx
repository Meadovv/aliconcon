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
    VStack,
    Select,
    useDisclosure,
} from '@chakra-ui/react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { FaCheckCircle } from "react-icons/fa";

import { closeModal } from '../../../reducer/actions/modal.slice';
import axios from 'axios';
import api from '../../../apis';

import { clearCart } from '../../../reducer/actions/cart.slice';

function ForUser({ information, setInformation }) {
    const [user, setUser] = React.useState(null);
    const [address, setAddress] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const getUser = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_INFORMATION,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                setUser(res.data.metadata);
                setInformation({
                    userId: res.data.metadata._id,
                    name: res.data.metadata.name,
                    phone: res.data.metadata.phone,
                    address: res.data.metadata.address[res.data.metadata.default_address],
                });
                setAddress(res.data.metadata.default_address);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    React.useEffect(() => {
        getUser();
    }, []);

    return loading ? (
        <div>Getting user information...</div>
    ) : (
        <VStack spacing={3}>
            <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input value={information?.name} isReadOnly />
            </FormControl>
            <FormControl id="phone">
                <FormLabel>Phone Number</FormLabel>
                <Input value={information?.phone} isReadOnly />
            </FormControl>
            <FormControl id="address">
                <FormLabel>Address</FormLabel>
                <Select
                    placeholder="Select address"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        setInformation({
                            ...information,
                            address: user?.address[e.target.value],
                        });
                    }}
                >
                    {user?.address.map((address, index) => (
                        <option key={index} value={index}>
                            {address}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </VStack>
    );
}

function ForGuest({ information, setInformation }) {
    return (
        <VStack spacing={3}>
            <FormControl id="name">
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your name"
                    onChange={(e) => setInformation({ ...information, name: e.target.value })}
                />
            </FormControl>
            <FormControl id="phone">
                <FormLabel>Phone Number</FormLabel>
                <Input
                    placeholder="Enter your phone number"
                    onChange={(e) => setInformation({ ...information, phone: e.target.value })}
                />
            </FormControl>
            <FormControl id="address">
                <FormLabel>Address</FormLabel>
                <Input
                    placeholder="Enter your address"
                    onChange={(e) => setInformation({ ...information, address: e.target.value })}
                />
            </FormControl>
        </VStack>
    );
}

function PaymentModal() {
    const { onClose } = useDisclosure();
    const modal = useSelector((state) => state.modal);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const { user } = useSelector((state) => state.auth);

    const [information, setInformation] = React.useState({
        userId: '',
        name: '',
        phone: '',
        address: '',
    });

    const onConfirm = async () => {
        if (!information.name || !information.phone || !information.address) {
            message.error('Please fill in all information');
            return;
        }
        setLoading(true);
        await axios
            .post(api.CHECKOUT, {
                information: information,
                carts: JSON.parse(localStorage.getItem('carts'))
            })
            .then((res) => {
                message.success(res.data.message);
                dispatch(closeModal({ modal: 'payment' }));
                if(!information.userId) dispatch(clearCart());
                onClose();
                navigate('/cart');
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const onCloseModal = () => {
        dispatch(closeModal({ modal: 'payment' }));
        onClose();
    };

    const renderPayment = () => {
        if (user) return <ForUser information={information} setInformation={setInformation} />;
        return <ForGuest information={information} setInformation={setInformation} />;
    };

    return (
        <>
            <Modal className="modal" isOpen={modal.payment} onClose={onCloseModal} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Your Information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {renderPayment()}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onConfirm} isLoading={loading}>
                            Confirm
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

export default PaymentModal;
