import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Image,
    Box,
    useDisclosure,
    Grid,
} from '@chakra-ui/react';

function MediaViewModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Replace with your actual image URLs
    const images = [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log(file);
    };

    return (
        <>
            <Button onClick={onOpen}>Choose Image</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Media View</ModalHeader>
                    <ModalBody>
                        <Grid templateColumns="repeat(6, 1fr)" gap={3}>
                            <Box
                                as="label"
                                htmlFor="file-upload"
                                w="150px"
                                h="150px"
                                border="2px"
                                borderColor="gray.200"
                                borderRadius="md"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                textAlign="center"
                                cursor="pointer"
                            >
                                Upload
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </Box>
                            {images.map((image, index) => (
                                <Box key={index} _hover={{ transform: 'scale(1.05)' }}>
                                    <Image src={image} alt={`Media content ${index + 1}`} />
                                </Box>
                            ))}
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default MediaViewModal;
