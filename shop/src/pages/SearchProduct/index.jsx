import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
    Flex,
    HStack,
    Button,
    Box,
    IconButton,
    Image,
} from '@chakra-ui/react';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';
import AddProductModal from '../../modals/add-modal/AddProduct';
import ViewProduct from '../../modals/view-detail-modal/ViewProduct';
import api from '../../apis';

export default function SearchProduct() {
    const user = useSelector((state) => state.auth.user);

    const [viewProductId, setViewProductId] = useState(null);

    const [recordPerPage, setRecordPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [dataList, setDataList] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        mode: 'all',
        name: null,
        email: null,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const viewProduct = (id) => {
        setViewProductId(id);
    };

    {/* Data functions */}
    const createDataList = () => {
        const dataList = [];
        products
            .filter(
                (product) =>
                    (filter.mode === 'all' ? true : product.status === filter.mode) &&
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
                setProducts(res.data.metadata);
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

    {/* Search functions*/}
    const handleSearchInputChange = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearchQuery(query);

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredProducts);
        setLoading(false);
    };

    const handleSearchClick = () => {
        setProducts(searchResults);
        setSearchQuery('');
    };

    const handleSearchResultClick = (product) => {
        setSearchResults([product]);
        setProducts([product]);
        setSearchQuery('');
    };

    {/* Pagination control functions*/}
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

    {/* Columns structure */}
    const columns = [
        {
            title: 'Thumbnail',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail) => <Image src={thumbnail} boxSize="50px" objectFit="cover" alt="thumbnail" />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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

    if (user && user.role < 4) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => viewProduct(record._id)}>View details</Button>
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

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        createDataList();
    }, [products, filter]);

    return (
        <Flex direction="column" gap={35}>
            <ViewProduct id={viewProductId} setId={setViewProductId} setProducts={setProducts} />
            <HStack justify="flex-end">
                <AddProductModal setProducts={setProducts} />
                <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                        bg: 'blue.500',
                    }}
                    leftIcon={<ArrowUpIcon />}
                >
                    Import
                </Button>
                <Button
                    bg={'red.400'}
                    color={'white'}
                    _hover={{
                        bg: 'red.500',
                    }}
                    leftIcon={<ArrowDownIcon />}
                >
                    Export
                </Button>
            </HStack>
            <Flex direction="column" gap={5}>
                <Flex alignItems="center">
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onPressEnter={handleSearchClick}
                    />
                    <IconButton
                        icon={<SearchIcon />}
                        onClick={handleSearchClick}
                        aria-label="Search products"
                        ml={2}
                    />
                </Flex>
                {searchResults.length > 0 && searchQuery && (
                    <Box bg="white" boxShadow="md" rounded="md" mt={2} p={2} maxHeight="200px" overflowY="auto">
                        {searchResults.map(product => (
                            <Box
                                key={product._id}
                                p={2}
                                borderBottom="1px solid"
                                borderColor="gray.200"
                                cursor="pointer"
                                onClick={() => handleSearchResultClick(product)}
                            >
                                {product.name}
                            </Box>
                        ))}
                    </Box>
                )}
            </Flex>
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
