import {
    Box,
    Grid,
    GridItem,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    Heading,
    Flex,
    Button,
} from '@chakra-ui/react';
import { Pagination } from 'antd';
import React from 'react';

import axios from 'axios';
import api from '../../apis';

export default function Media() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [images, setImages] = React.useState([]);
    const [page, setPage] = React.useState(5);

    const handleOpen = (image) => {
        setSelectedImage(image);
        onOpen();
    };

    const getImages = async () => {
        setImages((prev) => Array(30).fill('https://via.placeholder.com/150'));
    };

    React.useEffect(() => {
        getImages();
    }, []);

    return (
        <>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Heading as="h1" mb={4}>
                    Library
                </Heading>
                <Button colorScheme='green'>Add</Button>
            </Flex>
            <Flex justifyContent="center">
                <Pagination
                    mt={4}
                    total={300}
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
            >
                {images.map((image, i) => (
                    <GridItem key={i}>
                        <Box position="relative" onClick={() => handleOpen(image)}>
                            <Image src={image} boxSize="150px" />
                        </Box>
                    </GridItem>
                ))}
            </Grid>

            <Flex justifyContent="center">
                <Pagination
                    mt={4}
                    total={300}
                    current={page}
                    onChange={(page) => setPage((prev) => page)}
                    defaultPageSize={30}
                    showSizeChanger={false}
                />
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Image src={selectedImage} objectFit="contain" maxH="80vh" maxW="80vw" />
                </ModalContent>
            </Modal>
        </>
    );
}