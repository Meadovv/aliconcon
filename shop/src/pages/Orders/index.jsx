import { HStack, Button, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message, Tag } from 'antd';

import axios from 'axios';
import api from '../../apis';

import ViewOrder from '../../components/Modal/ViewOrder';

export default function Orders() {
    const user = useSelector((state) => state.auth.user);

    const [viewOrderId, setViewOrderId] = React.useState(null);

    const viewOrder = (id) => {
        setViewOrderId(id);
    };

    const columns = [
        {
            title: 'OrderID',
            dataIndex: '_id',
            key: '_id',
            width: 250,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                const date = new Date(createdAt);
                return date.toLocaleDateString();
            },
        },
        {
            title: 'Paid',
            dataIndex: 'paid',
            key: 'paid',
            render: (paid) => {
                return paid ? <Tag color="green">Paid</Tag> : <Tag color="red">Unpaid</Tag>;
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                return status ? <Tag color="green">Completed</Tag> : <Tag color="red">Shipping</Tag>;
            }
        },
    ];

    if (user && user.role < 4) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => viewOrder(record._id)}>View</Button>
                </Space>
            ),
        });
    }

    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);
    const [orders, serOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const getOrders = async () => {
        // Update this function to use your get orders API
        setLoading(true);
        await axios
            .post(
                api.GET_ORDERS,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                serOrders(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const createDataList = () => {
        const data = orders.map((order, index) => ({
            ...order,
            key: order._id,
        }));
        setDataList(data);
    }

    React.useEffect(() => {
        getOrders();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [orders]);

    return (
        <Flex direction="column" gap={5}>
            <ViewOrder id={viewOrderId} setId={setViewOrderId} />
            <HStack justify="flex-end">
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
