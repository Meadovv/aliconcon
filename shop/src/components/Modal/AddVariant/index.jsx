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
    HStack,
    VStack,
    List,
    ListItem,
    Text,
    Flex,
} from '@chakra-ui/react';
import { message } from 'antd';
import { useState } from 'react';

function AddVariantModal({ handleAddVariant }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [variantName, setVariantName] = useState('');
    const [variantOption, setVariantOption] = useState('');
    const [variantOptions, setVariantOptions] = useState([]);

    const handleAddOption = () => {
        setVariantOptions([...variantOptions, variantOption]);
        setVariantOption('');
    };

    const handleSubmit = () => {
        // Handle the submission of the form here
        handleAddVariant({
            name: variantName,
            options: variantOptions,
        });
        onCloseModal();
    };

    const handleRemoveOption = (index) => {
        const newOptions = [...variantOptions];
        newOptions.splice(index, 1);
        setVariantOptions(newOptions);
    };

    const onCloseModal = () => {
        setVariantName('');
        setVariantOption('');
        setVariantOptions([]);
        onClose();
    }

    return (
        <>
            <Button colorScheme="green" onClick={onOpen}>
                Add Variant
            </Button>

            <Modal isOpen={isOpen} onClose={onCloseModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a new variant</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Variant Name</FormLabel>
                                <Input value={variantName} onChange={(e) => setVariantName(e.target.value)} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Variant Options</FormLabel>
                                <HStack>
                                    <Input value={variantOption} onChange={(e) => setVariantOption(e.target.value)} />
                                    <Button onClick={handleAddOption} colorScheme="green" isDisabled={variantOption === '' || !variantOption}>
                                        Add
                                    </Button>
                                </HStack>
                                <Flex direction="column" gap={3} mt={3}>
                                    {variantOptions.map((option, index) => (
                                        <Flex justifyContent={'space-between'} key={index}>
                                            <Text>{option}</Text>
                                            <Button
                                                colorScheme="red"
                                                onClick={() => handleRemoveOption(index)}
                                            >
                                                Remove
                                            </Button>
                                        </Flex>
                                    ))}
                                </Flex>
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit} isDisabled={variantName === '' || !variantOptions.length}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onCloseModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddVariantModal;
