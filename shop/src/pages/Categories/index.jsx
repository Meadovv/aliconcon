import { HStack, Button, Flex, Box } from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';

import axios from 'axios';
import api from '../../apis';
import ViewCategoryModal from '../../modals/view-detail-modal/ViewCategory'
import ViewProdByCateModal from '../../modals/view-by-modal/ViewProdByCate';
import AddCategoryModal from '../../modals/add-modal/AddCategory';

export default function Categories() {

    const user = useSelector((state) => state.auth.user);

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        mode: 'all',
        name: null,
        email: null,
    });

    
    const [viewCategoryId, setViewCategoryId] = React.useState(null);
    const [viewProdByCate, setViewProdByCate] = React.useState({
        name : null,
        id : null,
    });

    {/* View modal functions*/}
    const viewCategory = (id) => {
        setViewCategoryId(id);
    };
    
    const viewProductOfCategory = (id, name) => {
        setViewProdByCate({
            name: name,
            id: id,
        });
    };
    
    {/* Columns structure */}
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
            title: 'Show products',
            key: 'status',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={() => viewProductOfCategory(record._id, record.name)}>
                        View products
                    </Button>
                </Space>
            ),
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
                    <Button onClick={() => viewCategory(record._id)}>View details</Button>

                    {/* Publishing options */}
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
        });
    }
    const createDataList = () => {
        const dataList = [];
        categories
            .filter(
                (category) =>
                    (filter.mode === 'all' ? true : category.status === filter.mode) &&
                    (filter.email ? category.addBy.email.includes(filter.email) : true) &&
                    (filter.name ? category.name.includes(filter.name) : true),
            )
            .forEach((category, index) => {
                dataList.push({
                    key: index,
                    _id: category._id,
                    name: category.name,
                    status: category.status,
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
                message.success(res.data.message);
                setCategories(res.data.metadata);
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
                api.SWITCH_CATEGORY_STATUS,
                {
                    categoryId: id,
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
                getCategories();
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
    }, [categories, filter]);

    return (
        <Flex direction="column" gap={35}>

            {/* View detail modal */}
            <ViewCategoryModal id={viewCategoryId} setId={setViewCategoryId} setCategories={setCategories} />
            <ViewProdByCateModal category={viewProdByCate} setCategory={setViewProdByCate} />

            {/* Add, Import, Export buttons */}
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
        </Flex>
    );
}
