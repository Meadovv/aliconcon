import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
} from '@chakra-ui/react';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { closeModal } from '../../../reducer/actions/modal.slice';

const defaultFilter = {
    category: '',
    lowPrice: 0,
    highPrice: 0,
}

export default function Filter({ categories, applyFilter }) {
    const dispatch = useDispatch();
    const { onClose } = useDisclosure();
    const modal = useSelector(state => state.modal);

    const [filter, setFilter] = React.useState(defaultFilter);

    const handleOnClose = () => {
        dispatch(closeModal({ modal: 'filter' }));
        onClose();
    }

    const handleApplyFilter = () => {
        applyFilter(filter);
        handleOnClose();
    }

    const handleReset = () => {
        setFilter(defaultFilter);
    }

    React.useEffect(() => {
        setFilter(defaultFilter);
    }, [categories])

    return (
        <>
            <Modal isOpen={modal.filter} onClose={handleOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filter</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {categories && (
                            <FormControl>
                                <FormLabel>Category</FormLabel>
                                <Select placeholder="Select category" onChange={(e) => setFilter({...filter, category: e.target.value})} value={filter.category}>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <FormControl>
                            <FormLabel>Low Price</FormLabel>
                            <Input type="number" onChange={(e) => setFilter({...filter, lowPrice: e.target.value})} value={filter.lowPrice}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>High Price</FormLabel>
                            <Input type="number" onChange={(e) => setFilter({...filter, highPrice: e.target.value})} value={filter.highPrice}/>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleOnClose}>
                            Close
                        </Button>
                        <Button colorScheme="red" mr={3} onClick={() => handleReset()}>Reset</Button>
                        <Button colorScheme="orange" onClick={handleApplyFilter}>Apply</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
