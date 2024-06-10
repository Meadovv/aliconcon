import { HStack, Button, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message } from 'antd';

import AddVoucherModal from '../../components/Modal/AddVoucher';

import axios from 'axios';
import api from '../../apis';

import ViewVoucherModal from '../../components/Modal/ViewVoucher';

export default function Vouchers() {
    const user = useSelector((state) => state.auth.user);

    const [viewVoucherId, setViewVoucherId] = React.useState(null);

    const viewVoucher = (id) => {
        setViewVoucherId(id);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
                    <Button onClick={() => viewVoucher(record._id)}>View</Button>
                </Space>
            ),
        });
    }

    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [vouchers, setVouchers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const createDataList = () => {
        // Update this function to match your voucher data structure
        const list = vouchers.map((voucher) => {
            return {
                _id: voucher._id,
                key: voucher._id,
                name: voucher.name,
                status: voucher.status,
                createdAt: voucher.createdAt,
                addBy: voucher.addBy.name,
            };
        });
        setDataList(list);
    };

    const getVouchers = async () => {
        // Update this function to use your get vouchers API
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
                setVouchers(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    React.useEffect(() => {
        getVouchers();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [vouchers]);

    return (
        <Flex direction="column" gap={5}>
            <ViewVoucherModal id={viewVoucherId} setId={setViewVoucherId} setVouchers={setVouchers} />
            <HStack justify="flex-end">
                <AddVoucherModal setVouchers={setVouchers} />
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
