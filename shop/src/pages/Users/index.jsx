import { HStack, Button, Flex, Box, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { Table, Space, Select, message, Tag } from 'antd';

import axios from 'axios';
import api from '../../apis';

import AddUserModal from '../../modals/add-modal/AddUser';
import ViewUserModal from '../../modals/view-detail-modal/ViewUser';

const ROLES = ['Owner', 'Admin', 'Moderator', 'Editor'];

const ROLE_COLORS = ['blue', 'green', 'orange', 'red'];

export default function Users() {

    const user = useSelector((state) => state.auth.user);

    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [users, setUsers] = React.useState([]);
    const [viewUserId, setViewUserId] = React.useState(null);

    const [dataList, setDataList] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    {/* Data functions */}
    const getUsers = async () => {
        setLoading(true);
        await axios
            .post(
                api.GET_USER_LIST,
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
                setUsers(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const createDataList = () => {
        if (!users.length) return;
        const data = users.map(
            (item) => {
                return {
                    key: item.user._id,
                    email: item.user.email,
                    role: ROLES[item.role - 1],
                    status: item.active ? 'Active' : 'Inactive',
                    createdAt: item.createdAt,
                    addBy: item.addBy.email,
                };
            }
        );
        setDataList(data);
    };

    const switchUserStatus = async (userId) => {
        await axios.post(
            api.SWITCH_USER_STATUS
            , { targetId: userId}
            , {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                },
            }
        ).then((res) => {
            message.success(res.data.message);
            setUsers(res.data.metadata);
        }).catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            responsive: ['md'],
            render: (role) => <Tag color={ROLE_COLORS[ROLES.indexOf(role)]}>{role}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            responsive: ['md']
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
            render: (text, record) => (
                <Space size="middle">
                    <Button 
                        isDisabled={user && user.role > 3}
                        onClick={() => setViewUserId(record.key)}
                    > 
                        View
                    </Button>

                    <Button 
                        isDisabled={user && user.role > 3}
                        colorScheme={record.status === 'Active' ? 'red' : 'blue'} 
                        onClick={() => switchUserStatus(record.key)}
                    >
                        {record.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                </Space>
            ),
        },
    ];

    React.useEffect(() => {
        getUsers();
    }, []);

    React.useEffect(() => {
        createDataList();
    }, [users]);

    return (
        <Flex direction="column" gap={5}>

            {/* View user button */}
            <ViewUserModal id={viewUserId} setId={setViewUserId} setUsers={setUsers}/>

            {/* Add user button */}
            <HStack justify="flex-end" >
                <AddUserModal setUsers={setUsers} />
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
                    <Select
                        defaultValue={recordPerPage}
                        style={{ width: 120 }}
                        onChange={(value) => setRecordPerPage(value)}
                    >
                        <Select.Option value={10}>10 / Page</Select.Option>
                        <Select.Option value={20}>15 / Page</Select.Option>
                        <Select.Option value={30}>20 / Page</Select.Option>
                    </Select>
                )}
            />            
        </Flex>
    );
}
