import { HStack, Button, Flex, Box } from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { Table, Space, Select, message, Tag, Popconfirm, Input } from 'antd';

import axios from 'axios';
import api from '../../apis';

import ViewGroupModal from '../../components/Modal/ViewGroup';
import ViewProdByGroupModal from '../../components/Modal/ViewProdByGroup';
import AddGroupModal from '../../components/Modal/AddGroup';

export default function Groups() {

    const user = useSelector((state) => state.auth.user);

    {/* View modals functions*/}
    const [viewGroupId, setViewGroupId] = React.useState(null);
    const [viewProdByGroup, setViewProdByGroup] = React.useState({
        name : null,
        id : null,
    });

    const viewGroup = (id) => {
        setViewGroupId(id);
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

    {/* Pagination control functions */}
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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
            render: (_, record) => {
                {/* View products of this group */}
                <Space size="middle">
                    <Button 
                        onClick={() => viewProductOfGroup(record._id, record.name)}
                    >
                        View products
                    </Button>
                </Space>
            },
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
                        onClick={() => viewGroup(record._id)}
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
            <ViewGroupModal id={viewGroupId} setId={setViewGroupId} setGroups={setGroups} />
            <ViewProdByGroupModal group={{viewProdByGroup}} setGroup={setViewProdByGroup} />

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
            {/* Pagination controls */}
            <Flex justify="center" alignItems="center" gap={2}>
                <IconButton
                    icon={<ChevronLeftIcon />}
                    onClick={handlePreviousPage}
                    isDisabled={currentPage === 1}
                    color={"gray.800"}
                    backgroundColor={"cyan.400"}
                    _hover={{ backgroundColor: "cyan.600" }}
                />
                <Box
                    borderWidth="8px"
                    borderRadius="md"
                    backgroundColor={"cyan.400"}
                    borderColor={"cyan.400"} 
                    color="gray.800"
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
