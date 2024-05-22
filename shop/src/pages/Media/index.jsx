import {
    Box,
    Grid,
    GridItem,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    Heading,
    Flex,
    Button,
    Spinner,
    Text
} from '@chakra-ui/react';
import { Pagination, message } from 'antd';
import React from 'react';

import axios from 'axios';
import api, { IMAGE_HOST } from '../../apis';

export default function Media() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [images, setImages] = React.useState([]);
    const [page, setPage] = React.useState(5);
    const [loading, setLoading] = React.useState(false);

    const handleOpen = (image) => {
        setSelectedImage(image);
        onOpen();
    };

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

    const handleDelete = async () => {

    }

    React.useEffect(() => {
        getImages();
    }, []);

    return (
        <>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Heading as="h1" mb={4}>
                    Library
                </Heading>
                <Button colorScheme="green">Add</Button>
            </Flex>
            <Flex justifyContent="center">
                <Pagination
                    mt={4}
                    total={images.length}
                    current={page}
                    onChange={(page) => setPage((prev) => page)}
                    defaultPageSize={30}
                    showSizeChanger={false}
                />
            </Flex>

            <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }}
                gap={6}
                justifyItems="center"
                alignItems="center"
                mt={4}
                mb={4}
                _loading={true}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    images.map((image, i) => (
                        <GridItem key={i}>
                            <Box position="relative" onClick={() => handleOpen(image)}>
                                <Image src={IMAGE_HOST.THUMBNAIL(image.name)} boxSize="150px" />
                            </Box>
                        </GridItem>
                    ))
                )}
            </Grid>

            <Flex justifyContent="center">
                <Pagination
                    mt={4}
                    total={images.length}
                    current={page}
                    onChange={(page) => setPage((prev) => page)}
                    defaultPageSize={30}
                    showSizeChanger={false}
                />
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>View Image</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image src={IMAGE_HOST.ORIGINAL(selectedImage?.name)} objectFit="contain" />
                        <Flex mt={3} justifyContent={'space-between'} alignItems={'center'}>
                            <Text>Add By: {selectedImage?.addedBy}</Text>
                            <Text>Create Date: {selectedImage?.addedDate}</Text>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
