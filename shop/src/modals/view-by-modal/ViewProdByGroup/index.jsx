import { 
    HStack, Button, Flex, Box, Image, useDisclosure, Modal, ModalBody, ModalCloseButton
    , ModalContent, ModalOverlay, ModalHeader, ModalFooter 
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector,  } from 'react-redux';

import { Table, Space, Select, message, Input, Tag, Popconfirm } from 'antd';

import axios from 'axios';
import api from '../../../apis';
import ViewProductModal from '../../view-detail-modal/ViewProduct';
import AddProductToGroupModal from '../../search-add-modal/AddProdToGroup';


export default function ViewProdByGroupModal({group, setGroup}) {
    
    const user = useSelector((state) => state.auth.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [viewProductId, setViewProductId] = React.useState(null);

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        mode: 'all',
        name: null,
    });
    
    {/* Data functions*/}
    const createDataList = () => {
        const dataList = [];
        products
            .filter(
                (product) =>
                    (filter.mode === 'all' ? true : product.status === filter.mode) &&
                    (filter.name ? product.name.includes(filter.name) : true),
            )
            .forEach((product, index) => {
                console.log(product);
                dataList.push({
                    key: index,
                    _id: product._id,
                    addBy: product.addToGroupBy,
                    name: product.name,
                    status: product.status,
                });
            });
        setDataList(dataList);
    };

    const getProducts = async () => {
        setLoading(true);
        await axios
            .post(
                api.VIEW_GROUP
                , {groupId: group.id}
                , {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setProducts(res.data.metadata);
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
                api.SWITCH_PRODUCT_STATUS,
                {
                    productId: id,
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
                getProducts();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    {/* Remove from group */}
    const removeProdFromGroup = async (productId) => {
        setLoading(true);
        await axios
            .post(
                api.REMOVE_PRODUCT_FROM_GROUP,
                {groupId: group.id, productId: productId},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setProducts(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    {/* View Product detail */}
    const viewProduct = (id) => {
        setViewProductId(id);
    };

    {/* Columns structure */}
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Added in group by',
            dataIndex: 'addBy',
            key: 'addBy',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => <Tag color={status === 'draft' ? 'red' : 'green'}>{status}</Tag>,
        },
    ];

    {/* Quick actions columns with view detail and publish button */}
    if (user && user.role < 3) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">

                    {/* View detail button */}
                    <Button onClick={() => viewProduct(record._id)}>View details</Button>

                    {/* Publishing options */}
                    <Popconfirm
                        title={
                            record.status === 'draft'
                                ? 'Are you sure you want to publish this product?'
                                : 'Are you sure you want to unpublish this product?'
                        }
                        onConfirm={() => switchStatus(record._id)}
                        okText={record.status === 'draft' ? 'Publish' : 'Unpublish'}
                        cancelText="No"
                        okButtonProps={{size: 'large',}}
                        cancelButtonProps={{size: 'large',}}
                        overlayStyle={{ zIndex: 2000 }}
                    >
                        <Button colorScheme={record.status === 'draft' ? 'blue' : 'red'}>
                            {record.status === 'draft' ? 'Publish' : 'Unpublish'}
                        </Button>
                    </Popconfirm>

                    {/* Remove from group options */}
                    <Popconfirm
                        title={'Are you sure you want to remove this product from the group ?'}
                        onConfirm={() => removeProdFromGroup(record._id)}
                        okText={'Remove'}
                        cancelText="No"
                        okButtonProps={{size: 'large',}}
                        cancelButtonProps={{size: 'large',}}
                        overlayStyle={{ zIndex: 2000 }}
                    >
                        <Button colorScheme={'red'}>
                            {'Remove from the group'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        });
    }

    const onCloseModal = async () => {
        setGroup({
            name : null,
            id : null,
        });
        onClose();
    }

    React.useEffect(() => {
        if(!group.id) return;
        onOpen();
        getProducts();
    }, [group]);

    React.useEffect(() => {
        createDataList();
    }, [products, filter]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal} size={''}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Products of Group: {group.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={35}>
                        {/* View detail modal */}
                        <ViewProductModal id={viewProductId} setId={setViewProductId} setProducts={setProducts} />
                        {/* The actual table */}

                        {/* Add product to this group buttons */}
                        <HStack justify="flex-end" display={user && user.role < 3 ? 'flex' : 'none'}>
                            <AddProductToGroupModal groupId={group.id} resetProdByGroup={getProducts} />
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
                                    </HStack>
                                </Flex>
                            )}
                        />
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={onCloseModal}
                        isLoading={loading}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
