import { HStack, Button, Flex, Box } from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';

import axios from 'axios';
import api from '../../apis';

import ViewGroup from '../../modals/view-detail-modal/ViewGroup'
import ViewProdByGroupModal from '../../modals/view-by-modal/ViewProdByGroup';
import AddGroupModal from '../../modals/add-modal/AddGroup';

export default function Groups() {

    const user = useSelector((state) => state.auth.user);

    {/* View modals functions*/}
    const [viewGroup, setViewGroup] = React.useState({
        name : null,
        id : null,
    });
    const [viewProdByGroup, setViewProdByGroup] = React.useState({
        name : null,
        id : null,
    });

    const viewgroup = (id, name) => {
        setViewGroup({
            name: name,
            id: id,
        });
    };
    
    const viewProductOfGroup = (id, name) => {
        setViewProdByGroup({
            name: name,
            id: id,
        });
    };

    {/* States and data functions*/}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);

    const [dataList, setDataList] = React.useState([]);

    const [groups, setGroups] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        name: null,
        email: null,
    });

    const createDataList = () => {
        const dataList = [];
        groups
            .filter(
                (group) =>
                    (filter.email ? group.addBy.email.includes(filter.email) : true) &&
                    (filter.name ? group.name.includes(filter.name) : true),
            )
            .forEach((group, index) => {
                dataList.push({
                    key: index,
                    _id: group._id,
                    name: group.name,
                    createdAt: group.createdAt,
                    addBy: group.addBy.email,
                });
            });
        setDataList(dataList);
    };

    const getGroups = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_GROUPS,
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
                setGroups(res.data.metadata);
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
        {
            title: 'Show products',
            key: 'status',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        onClick={() => viewProductOfGroup(record._id, record.name)}
                    >
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
                    <Button 
                        onClick={() => viewgroup(record._id, record.name)}
                    >
                        View details
                    </Button>
                </Space>
            ),
        });
    }

    React.useEffect(() => {
        getGroups();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [groups, filter]);

    return (
        <Flex direction="column" gap={35}>

            {/* View detail modal */}
            <ViewGroup group={viewGroup} setGroup={setViewGroup} setGroups={setGroups} />
            <ViewProdByGroupModal group={viewProdByGroup} setGroup={setViewProdByGroup} />

            {/* Add, Import, Export buttons */}
            <HStack justify="flex-end">
                <AddGroupModal setGroups={setGroups} />
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
