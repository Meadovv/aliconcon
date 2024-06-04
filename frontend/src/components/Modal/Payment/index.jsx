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
    useDisclosure,
} from '@chakra-ui/react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { closeModal } from '../../../reducer/actions/modal.slice';
import axios from 'axios';
import api from '../../../apis';

function PaymentModal() {
    const { onClose } = useDisclosure();
    const modal = useSelector((state) => state.modal);
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const { user } = useSelector((state) => state.auth);

    const onCloseModal = () => {
        dispatch(closeModal({ modal: 'payment' }));
        onClose();
    }

    return (
        <>
            <Modal className='modal' isOpen={modal.payment} onClose={onCloseModal} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Your Information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={null} isLoading={loading}>
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
