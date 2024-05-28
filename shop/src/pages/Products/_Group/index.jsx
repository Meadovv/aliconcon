import React from 'react';
import { HStack, Button, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';

import { Table, Space, Select, message, Tag, Popconfirm } from 'antd';

import { useSelector } from 'react-redux';

import AddProductModal from '../../../components/Modal/AddProduct';

export default function Groups() {
    const [products, setProducts] = React.useState([
        {
            name: 'Product 1',
            status: 'draft',
            createdAt: '2021-09-01T00:00:00.000Z',
            addBy: 'Admin',
        },
    ]);
    const [loading, setLoading] = React.useState(false);
    const [dataList, setDataList] = React.useState([]);
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);

    const { user, shop } = useSelector((state) => state.auth);

    const getProducts = async () => {
        
    };

    const createDataList = () => {
        const dataList = products.map((product, index) => ({
            key: index,
            ...product,
        }));
        setDataList(dataList);
    };

    const switchStatus = (id) => {};

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
                    <Button>View</Button>
                    <Popconfirm
                        title={
                            record.status === 'draft'
                                ? 'Are you sure you want to publish this category?'
                                : 'Are you sure you want to unpublish this category?'
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
        },
    ];

    return (
        <Flex direction={'column'} gap={5}>
            <HStack justify="flex-end">
                <AddProductModal />
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
