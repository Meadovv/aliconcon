import React, { useState, useEffect } from 'react';
import { HStack, Button, Flex, Box, IconButton } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Table, Space, Select, message, Input, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import api from '../../apis';
import AddVoucherModal from '../../components/Modal/AddVoucher';  // Assuming you have a similar modal for adding vouchers
import ViewVoucherModal from '../../components/Modal/ViewVoucher';  // Assuming you have a similar modal for viewing vouchers

export default function Vouchers() {
    const user = useSelector((state) => state.auth.user);

    {/* States */}
    const [viewVoucherId, setViewVoucherId] = useState(null);
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [recordPerPage, setRecordPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        mode: 'all',
        name: null,
        email: null,
    });

    const viewVoucher = (id) => {
        setViewVoucherId(id);
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
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'draft' ? 'red' : 'green'}>{status}</Tag>,
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (startDate) => {
                const date = new Date(startDate);
                return date.toLocaleDateString();
            },
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (endDate) => {
                const date = new Date(endDate);
                return date.toLocaleDateString();
            },
        },
    ];

    if (user && user.role < 4) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => viewVoucher(record._id)}>View details</Button>
                    <Popconfirm
                        title={
                            record.status
                                ? 'Are you sure you want to deactivate this voucher?'
                                : 'Are you sure you want to activate this voucher?'
                        }
                        onConfirm={() => switchStatus(record._id)}
                        okText={record.status ? 'Deactivate' : 'Activate'}
                        cancelText="No"
                        okButtonProps={{
                            size: 'large',
                        }}
                        cancelButtonProps={{
                            size: 'large',
                        }}
                    >
                        <Button colorScheme={record.status === 'draft' ? 'blue' : 'red'}>
                            {record.status ? 'Deactivate' : 'Activate'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        });
    }

    const createDataList = () => {
        const dataList = [];
        vouchers
            .filter(
                (voucher) =>
                    (filter.email ? voucher.addBy.email.includes(filter.email) : true) &&
                    (filter.name ? voucher.name.includes(filter.name) : true),
            )
            .forEach((voucher, index) => {
                dataList.push({
                    key: index,
                    _id: voucher._id,
                    name: voucher.name,
                    status: voucher.status,
                    startDate: voucher.startDate,
                    endDate: voucher.endDate,
                    addBy: voucher.addBy.email,
                });
            });
        setDataList(dataList);
    };

    const getVouchers = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_VOUCHERS,  
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
                setVouchers(res.data.metadata);
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
                api.SWITCH_VOUCHER, 
                {
                    voucherId: id,
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
                getVouchers();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    useEffect(() => {
        getVouchers();
    }, []);

    useEffect(() => {
        createDataList();
    }, [vouchers, filter]);

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
        <Flex direction="column" gap={35}>

            {/* View detail modal */}
            <ViewVoucherModal id={viewVoucherId} setId={setViewVoucherId} setVouchers={setVouchers} />

            {/* Add, Import, Export buttons */}
            <HStack justify="flex-end">
                <AddVoucherModal setVouchers={setVouchers} />
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
    );
}
