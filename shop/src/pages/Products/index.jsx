import React from 'react';
import { HStack, Button, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

import { Table, Space, Select, message, Tag, Popconfirm } from 'antd';

import { useSelector } from 'react-redux';

import AddProductModal from '../../components/Modal/AddProduct';
import ViewProduct from '../../components/Modal/ViewProduct';
import axios from 'axios';
import api from '../../apis';

export default function Products() {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [dataList, setDataList] = React.useState([]);
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [viewProductId, setViewProductId] = React.useState(null);

    const { user, shop } = useSelector((state) => state.auth);

    const getProducts = async () => {
        setLoading(true);
        await axios.post(api.GET_PRODUCTS, {}, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client')
            }
        })
        .then(res => {
            setProducts(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
        setLoading(false);
    };

    const createDataList = () => {
        const dataList = products.map((product, index) => ({
            ...product,
            key: product._id,
            addBy: product.addBy.name,
        }));
        setDataList(dataList);
    };

    const switchStatus = async (id) => {
        await axios.post(api.SWITCH_PRODUCT_STATUS, {
            productId: id
        }, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client')
            }
        })
        .then(res => {
            message.success(res.data.message);
            setProducts(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    };

    React.useEffect(() => {
        if (shop) getProducts();
    }, [shop]);

    React.useEffect(() => {
        createDataList();
    }, [products]);

    const columns = [
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
        {
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => setViewProductId(record._id)}>View</Button>
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
                        <Button colorScheme={record.status === 'draft' ? 'blue' : 'red'} style={{
                            display: user?.role > 3 ? 'none' : 'block'
                        }}>
                            {record.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Flex direction={'column'} gap={5}>
            <HStack justify="flex-end">
                <ViewProduct id={viewProductId} setId={setViewProductId} setProducts={setProducts}/>
                <AddProductModal setProducts={setProducts}/>
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
                    </HStack>
                )}
            />
        </Flex>
    );
}
