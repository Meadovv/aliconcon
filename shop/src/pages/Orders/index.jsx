import React from 'react';
import { HStack, Button, Flex, Box } from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';

import axios from 'axios';
import api from '../../apis';
// import ViewOrderModal from '../../modals/view-detail-modal/ViewOrder';
// import AddOrderModal from '../../modals/add-modal/AddOrder';

export default function Orders() {

    const user = useSelector((state) => state.auth.user);

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        status: 'all',
        paid: 'all',
        userName: null,
    });

    const [viewOrderId, setViewOrderId] = React.useState(null);

    {/* View modal functions*/}
    const viewOrder = (id) => {
        setViewOrderId(id);
    };
    
    const createDataList = () => {
        const dataList = [];
        orders
            .filter(
                (order) =>
                    (filter.status === 'all' ? true : order.status === parseInt(filter.status)) &&
                    (filter.paid === 'all' ? true : order.paid === parseInt(filter.paid)) &&
                    (filter.userName ? order.user_name.includes(filter.userName) : true)
            )
            .forEach((order, index) => {
                dataList.push({
                    key: index,
                    _id: order._id,
                    user_name: order.user_name,
                    total: order.total,
                    status: order.status,
                    paid: order.paid,
                });
            });
        setDataList(dataList);
    };

    const getOrders = async () => {
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
                message.success(res.data.message);
                setOrders(res.data.metadata);
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
                api.SWITCH_ORDER_STATUS,
                {
                    orderId: id,
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
                getOrders();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    {/* Columns structure */}
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `$${total.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 0 ? 'red' : 'green'}>{status === 0 ? 'Pending' : 'Completed'}</Tag>,
        },
        {
            title: 'Paid',
            dataIndex: 'paid',
            key: 'paid',
            render: (paid) => <Tag color={paid === 0 ? 'red' : 'green'}>{paid === 0 ? 'Unpaid' : 'Paid'}</Tag>,
        },
    ];

    {/* Quick actions columns with view detail and publish button */}
    if (user && user.role < 3) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {/* Change status options */}
                    <Popconfirm
                        title={
                            record.status === 0
                                ? 'Are you sure you want to mark this order as completed?'
                                : 'Are you sure you want to mark this order as pending?'
                        }
                        onConfirm={() => switchStatus(record._id)}
                        okText={record.status === 0 ? 'Complete' : 'Pending'}
                        cancelText="No"
                        okButtonProps={{
                            size: 'large',
                        }}
                        cancelButtonProps={{
                            size: 'large',
                        }}
                        overlayStyle={{ zIndex: 2000 }}
                    >
                        <Button 
                            colorScheme={record.status === 0 ? 'blue' : 'red'}
                        >
                            {record.status === 0 ? 'Complete' : 'Pending'}
                        </Button>
                    </Popconfirm>
                    
                    {/* View detail button */}
                    <Button onClick={() => viewOrder(record._id)}>View details</Button>
                </Space>
            ),
        });
    }

    React.useEffect(() => {
        getOrders();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [orders, filter]);

    return (
        <Flex direction="column" gap={35}>

            {/* View detail modal */}
            <ViewOrderModal id={viewOrderId} setId={setViewOrderId} setOrders={setOrders} />

            {/* Add, Import, Export buttons */}
            <HStack justify="flex-end">
                
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
                    <Flex gap={250}>

                        {/* Filter mode */}
                        <HStack justify="flex-start">
                            <Select
                                defaultValue={filter.status}
                                style={{ minWidth: 110 }}
                                onChange={(value) => setFilter({ ...filter, status: value })}
                            >
                                <Select.Option value="all">All</Select.Option>
                                <Select.Option value="0">Pending</Select.Option>
                                <Select.Option value="1">Completed</Select.Option>
                            </Select>
                            <Select
                                defaultValue={filter.paid}
                                style={{ minWidth: 110 }}
                                onChange={(value) => setFilter({ ...filter, paid: value })}
                            >
                                <Select.Option value="all">All</Select.Option>
                                <Select.Option value="0">Unpaid</Select.Option>
                                <Select.Option value="1">Paid</Select.Option>
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
                                placeholder="User name"
                                onChange={(e) => setFilter({ ...filter, userName: e.target.value })}
                                value={filter.userName}
                            />
                        </HStack>
                    </Flex>                 
                )}
            />
        </Flex>
    );
}
