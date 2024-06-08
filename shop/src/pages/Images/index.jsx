import React, { useState, useEffect } from 'react';
import { HStack, Button, Flex, Box, IconButton, Input as ChakraInput, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Table, Space, Popconfirm, message, Select } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api, { IMAGE_HOST } from '../../apis';

export default function Images() {
    const user = useSelector((state) => state.auth.user);

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [recordPerPage, setRecordPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        name: '',
        email: '',
    });
    const [file, setFile] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState('');
    const [fileName, setFileName] = useState('Choose a file for uploading');

    const createDataList = () => {
        const dataList = [];
        images
            .filter(
                (image) =>
                    (filter.email ? image.addBy.email.includes(filter.email) : true) &&
                    (filter.name ? image.name.includes(filter.name) : true)
            )
            .forEach((image, index) => {
                dataList.push({
                    key: index,
                    _id: image._id,
                    name: image.name,
                    addBy: image.addBy.email,
                    createdAt: image.createdAt
                });
            });
        setDataList(dataList);
    };

    const getImages = async () => {
        setLoading(true);
        await axios.post(
            api.GET_IMAGES
            ,{}
            ,{
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                }
            }
        )
        .then((res) => {
            message.success(res.data.message);
            setImages(res.data.metadata);
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file ? file.name : 'Choose a file for uploading');
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select a file');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(
            api.UPLOAD_IMAGE
            , formData
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        .then((res) => {
            message.success(res.data.message);
            setImages(res.data.metadata);
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        await axios.post(
            api.DELETE_IMAGE
            , { imageId: id }
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                }
            }
        )
        .then((res) => {
            message.success(res.data.message);
            setImages(res.data.metadata);
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    const handleViewImage = (name) => {
        const imageUrl = IMAGE_HOST.ORIGINAL(name);
        setSelectedImage(imageUrl);
        onOpen();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Added By',
            dataIndex: 'addBy',
            key: 'addBy',
        },
    ];

    if (user && user.role < 3) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {/* Detete image button */}
                    <Popconfirm
                        title={'Are you sure you want to delete this image ?'}
                        onConfirm={() => handleDelete(record._id)}
                        okText={'Delete'}
                        cancelText="No"
                        okButtonProps={{size: 'large',}}
                        cancelButtonProps={{size: 'large',}}
                        overlayStyle={{ zIndex: 2000 }}
                    >
                        <Button colorScheme={'red'}>
                            {'Delete image'}
                        </Button>
                    </Popconfirm>

                    {/* View image button */}
                    <Button colorScheme="blue" onClick={() => handleViewImage(record.name)}>
                        View Image
                    </Button>
                </Space>
            ),
        });
    }

    useEffect(() => {
        getImages();
    }, []);

    useEffect(() => {
        createDataList();
    }, [images, filter]);

    return (
        <Flex direction="column" gap={6}>
            <HStack justify="flex-end">
                <Box>
                    <ChakraInput
                        type="file"
                        onChange={handleFileChange}
                        display="none"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button as="span" cursor="pointer" colorScheme={'green'} color={'white'}>
                            {fileName}
                        </Button>
                    </label>
                </Box>
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{ bg: 'blue.500' }}
                    leftIcon={<ArrowUpIcon />}
                    onClick={handleUpload}
                >
                    Add Image
                </Button>
            </HStack>
            <Table
                loading={loading}
                columns={columns}
                dataSource={dataList}
                pagination={{
                    pageSize: recordPerPage,
                    current: currentPage,
                    onChange: (page) => setCurrentPage(page),
                }}
                footer={() => (
                    <Flex direction="column" gap={3}>
                        <HStack justify="flex-start">
                            <Select
                                defaultValue={recordPerPage}
                                style={{ width: 120 }}
                                onChange={(value) => setRecordPerPage(value)}
                            >
                                <Select.Option value={5}>5 / Page</Select.Option>
                                <Select.Option value={10}>10 / Page</Select.Option>
                                <Select.Option value={15}>15 / Page</Select.Option>
                            </Select>
                            <ChakraInput
                                placeholder="Name"
                                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                                value={filter.name}
                            />
                            <ChakraInput
                                placeholder="Email"
                                onChange={(e) => setFilter({ ...filter, email: e.target.value })}
                                value={filter.email}
                            />
                        </HStack>
                    </Flex>
                )}
            />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Image Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image src={selectedImage} alt="Selected Image" />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
