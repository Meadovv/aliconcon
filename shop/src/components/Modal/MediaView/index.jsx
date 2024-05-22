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
    Spinner,
} from '@chakra-ui/react';
import React from 'react';

import axios from 'axios';
import api, { IMAGE_HOST } from '../../../apis';
import { message } from 'antd';

function MediaViewModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [images, setImages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const getImages = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_IMAGE,
                {},
                {
                    headers: {
                        'x-token-id': localStorage.getItem('token'),
                        'x-client-id': localStorage.getItem('client'),
                    },
                },
            )
            .then((res) => {
                setImages(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const handleFileUpload = (e) => {
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
    
        // Send a POST request with the form data
        axios.post(api.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client'),
            },
        })
        .then((res) => {
            message.success(res.data.message)
            setImages(res.data.metadata);
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
    };

    React.useEffect(() => {
        getImages();
    }, []);

    return (
        <>
            <Button onClick={onOpen}>Choose Image</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Media View</ModalHeader>
                    <ModalBody>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <Grid
                                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }}
                                gap={3}
                                justifyItems="center"
                                alignItems="center"
                            >
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
                                        <Image src={IMAGE_HOST.THUMBNAIL(image.name)} alt={`Media content ${index + 1}`} />
                                    </Box>
                                ))}
                            </Grid>
                        )}
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
