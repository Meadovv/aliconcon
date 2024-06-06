import { HStack, Button, Flex, Box, Image } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message, Input, Tag, Popconfirm } from 'antd';

import axios from 'axios';
import api from '../../apis';

import AddProductModal from '../../modals/add-modal/AddProduct';
import ViewProductModal from '../../modals/view-detail-modal/ViewProduct';

export default function Products() {
    
    const user = useSelector((state) => state.auth.user);

    {/* States */}
    const [viewProductId, setViewProductId] = React.useState(null);

    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        mode: 'all',
        name: null,
        addBy: null,
    });
    
    const viewProduct = (id) => {
        setViewProductId(id);
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

                    {/* View detail modal */}
                    <Button onClick={() => viewProduct(record._id)}>View details</Button>

                </Space>
            ),
        });
    }

    const createDataList = () => {
        const dataList = [];
        products
            .filter(
                (product) =>
                    (filter.addBy ? product.addBy.name.includes(filter.addBy) : true) &&
                    (filter.name ? product.name.includes(filter.name) : true),
            )
            .forEach((product, index) => {
                dataList.push({
                    key: index,
                    _id: product._id,
                    thumbnail: product.thumbnail,
                    name: product.name,
                    addBy: product.addBy.name,
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

    React.useEffect(() => {
        getProducts();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [products, filter]);

    return (
        <Flex direction="column" gap={35}>

            {/* View detail modal */}
            <ViewProductModal id={viewProductId} setId={setViewProductId} setProducts={setProducts} />

            {/* Add, Import, Export buttons */}
            <HStack justify="flex-end">
                <AddProductModal resetProducts={getProducts} />
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
                                placeholder="Added By"
                                onChange={(e) => setFilter({ ...filter, addBy: e.target.value })}
                                value={filter.addBy}
                            />
                        </HStack>
                    </Flex>
                )}
            />
        </Flex>
    );
}
