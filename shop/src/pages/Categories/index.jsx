import { HStack, Button, Flex } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';

import AddCategoryModal from '../../components/Modal/AddCategory';

import axios from 'axios';
import api from '../../apis';

import ViewCategoryModal from '../../components/Modal/ViewCategory';

export default function Categories() {
    const user = useSelector((state) => state.auth.user);

    const [viewCategoryId, setViewCategoryId] = React.useState(null);

    const viewCategory = (id) => {
        setViewCategoryId(id);
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
                    <Button onClick={() => viewCategory(record._id)}>View</Button>
                </Space>
            ),
        });
    }

    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const createDataList = () => {
        const dataList = [];
        categories
            .forEach((category, index) => {
                dataList.push({
                    key: index,
                    _id: category._id,
                    name: category.name,
                    createdAt: category.createdAt,
                    addBy: category.addBy.email,
                });
            });
        setDataList(dataList);
    };

    const getCategories = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_CATEGORIES,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                setCategories(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };
    
    React.useEffect(() => {
        getCategories();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [categories]);

    return (
        <Flex direction="column" gap={5}>
            <ViewCategoryModal id={viewCategoryId} setId={setViewCategoryId} setCategories={setCategories} />
            <HStack justify="flex-end">
                <AddCategoryModal setCategories={setCategories} />
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
