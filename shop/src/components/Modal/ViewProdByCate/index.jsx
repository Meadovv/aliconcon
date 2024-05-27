import { HStack, Button, Flex, Box, Image, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, ModalHeader, ModalFooter } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector,  } from 'react-redux';

import { Table, Space, Select, message, Input } from 'antd';

import axios from 'axios';
import api from '../../../apis';
import ViewProductModal from '../ViewProduct';


export default function ViewProdByCateModal({category, setCategory}) {
    
    const user = useSelector((state) => state.auth.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [viewProductId, setViewProductId] = React.useState(null);

    const viewProduct = (id) => {
        setViewProductId(id);
    };

    {/* Columns structure */}
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail) => <Image src={thumbnail} boxSize="50px" objectFit="cover" alt="thumbnail" />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'draft' ? 'red' : 'green'}>{status}</Tag>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['md'], // This column will be hidden on screens smaller than md
            render: (createdAt) => {
                const date = new Date(createdAt);
                return date.toLocaleDateString();
            },
        },
        {
            title: 'Added By',
            dataIndex: 'addBy',
            key: 'addedBy',
            responsive: ['md'], // This column will be hidden on screens smaller than md
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
                    <Button onClick={() => viewProduct(record._id)}>View details</Button>

                    {/* Publishing options */}
                    <Popconfirm
                        title={
                            record.status === 'draft'
                                ? 'Are you sure you want to publish this product?'
                                : 'Are you sure you want to unpublish this product?'
                        }
                        onConfirm={() => switchStatus(record._id)}
                        okText={record.status === 'draft' ? 'Publish' : 'Unpublish'}
                        cancelText="No"
                        okButtonProps={{
                            size: 'large',
                        }}
                        cancelButtonProps={{
                            size: 'large',
                        }}
                    >
                        <Button colorScheme={record.status === 'draft' ? 'blue' : 'red'}>
                            {record.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        });
    }

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        mode: 'all',
        name: null,
        email: null,
    });

    const createDataList = () => {
        const dataList = [];
        products
            .filter(
                (product) =>
                    (filter.email ? product.addBy.email.includes(filter.email) : true) &&
                    (filter.name ? product.name.includes(filter.name) : true),
            )
            .forEach((product, index) => {
                dataList.push({
                    key: index,
                    _id: product._id,
                    thumbnail: product.thumbnail,
                    name: product.name,
                    status: product.status,
                    createdAt: product.createdAt,
                    addBy: product.addBy.email,
                });
            });
        setDataList(dataList);
    };

    const getProducts = async () => {
        onOpen();
        setLoading(true);
        await axios
            .post(
                api.GET_PRODUCTS,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setProducts(
                    (res.data.metadata).filter(
                        (product) => (product.category.includes(category.name)))
                );
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const switchStatus = async (id) => {
        setLoading(true);
        await axios
            .post(
                api.SWITCH_PRODUCT_STATUS,
                {
                    productId: id,
                },
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                getProducts();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    React.useEffect(() => {
        if(!category.id) return;
        getProducts();
    }, [category]);

    React.useEffect(() => {
        createDataList();
    }, [products, filter]);

    const onCloseModal = async () => {
        setCategory({
            name : null,
            id : false,
        });
        onClose();
    }

    {/* Pagination control functions */}
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

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Products of Category: {category.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={35}>
                        {/* View detail modal */}
                        <ViewProductModal id={viewProductId} setId={setViewProductId} setProducts={setProducts} />
                        {/* The actual table */}
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
                                    {/* Filter controls */}
                                    <HStack justify="flex-start">
                                        <Select
                                            defaultValue={filter.mode}
                                            style={{ minWidth: 110 }}
                                            onChange={(value) => setFilter({ ...filter, mode: value })}
                                        >
                                            <Select.Option value="all">All</Select.Option>
                                            <Select.Option value="draft">Draft</Select.Option>
                                            <Select.Option value="published">Published</Select.Option>
                                        </Select>
                                        <Select
                                            defaultValue={recordPerPage}
                                            style={{ width: 120 }}
                                            onChange={(value) => setRecordPerPage(value)}
                                        >
                                            <Select.Option value={5}>5 / Page</Select.Option>
                                            <Select.Option value={10}>10 / Page</Select.Option>
                                            <Select.Option value={15}>15 / Page</Select.Option>
                                        </Select>
                                        <Input
                                            placeholder="Name"
                                            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                                            value={filter.name}
                                        />
                                        <Input
                                            placeholder="Email"
                                            onChange={(e) => setFilter({ ...filter, email: e.target.value })}
                                            value={filter.email}
                                        />
                                    </HStack>
                                </Flex>
                            )}
                        />
                        {/* Pagination controls */}
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
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={onCloseModal}
                        isLoading={loading}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
