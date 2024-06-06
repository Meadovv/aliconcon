import React, { useState, useEffect } from 'react';
import { HStack, Button, Flex, Box, IconButton, Input as ChakraInput } from '@chakra-ui/react';
import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Table, Space, Popconfirm, message, Select, } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../apis'

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
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            message.error('Please select a file');
            return;
        }
        setLoading(true);
        await axios.post(
            api.UPLOAD_IMAGE
            , { file: file }
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

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(dataList.length / recordPerPage)) {
            setCurrentPage(currentPage + 1);
        }
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
    {/* Quick actions columns with view detail and publish button */}
    if (user && user.role < 4) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">

                    {/* View detail button */}
                    
                    {/* Delete options */}
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
                <Popconfirm
                    title={
                        <ChakraInput type="file" onChange={handleFileChange} />
                    }
                    onConfirm={handleUpload}
                    okText="Upload"
                    cancelText="Cancel"
                    overlayStyle={{ zIndex: 2000 }}
                >
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{ bg: 'blue.500' }}
                        leftIcon={<ArrowUpIcon />}
                    >
                        Add Image
                    </Button>
                </Popconfirm>
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
            <Flex justify="flex-end" alignItems="center" gap={2}>
                <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={handlePreviousPage}
                    isDisabled={currentPage === 1}
                    color={"gray.800"}
                    backgroundColor={"cyan.400"}
                    _hover={{ backgroundColor: "cyan.600" }}
                />
                <Box
                    borderWidth="1px"
                    borderRadius="md"
                    backgroundColor={"cyan.400"}
                    borderColor={"cyan.400"}
                    color="gray.800"
                    p={2}
                    fontSize="xl"
                    fontWeight="semibold"
                >
                    {`Page ${currentPage} of ${Math.ceil(dataList.length / recordPerPage)}`}
                </Box>
                <IconButton
                    icon={<ChevronRightIcon />}
                    onClick={handleNextPage}
                    isDisabled={currentPage === Math.ceil(dataList.length / recordPerPage)}
                    color={"gray.800"}
                    backgroundColor={"cyan.400"}
                    _hover={{ backgroundColor: "cyan.600" }}
                />
            </Flex>
        </Flex>
    );
}
