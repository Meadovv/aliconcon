import { HStack, Button, Flex, Box, Image, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, ModalHeader, ModalFooter } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector,  } from 'react-redux';

import { Table, Space, Select, message, Input } from 'antd';

import axios from 'axios';
import api from '../../../apis';
import ViewProductModal from '../ViewProduct';
import AddProductToGroupModal from '../AddProdToGroup';


export default function ViewItemByVouModal({data, setData}) {
    
    const user = useSelector((state) => state.auth.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [viewProductId, setViewProductId] = React.useState(null);

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [dataList, setDataList] = React.useState([]);

    const [items, setItems] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [groups, setGroups] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        mode: 'all',
    });
    
    const [activeTab, setActiveTab] = useState('Products');

    {/* Change active tab */}
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    {/* Data functions*/}
    const createDataList = (activeTab) => {
        if(activeTab === 'Products'){
            const dataList = [];
            products
                .filter(
                    (product) =>
                        (filter.mode === 'all' ? true : product.status === filter.mode) &&
                        (filter.email ? product.addBy.email.includes(filter.email) : true) &&
                        (filter.name ? product.name.includes(filter.name) : true),
                )
                .forEach((product, index) => {
                    dataList.push({
                        key: index,
                        _id: product._id,
                        name: product.name,
                        createdAt: product.createdAt,
                        addBy: product.addBy.email,
                    });
                });
            setDataList(dataList);
        }
        else{
            const dataList = [];
            groups.filter(
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
        }
    };

    const getProducts = async () => {
        setProducts(items.filter(item => item.kind === 'aliconcon_products'));
        onOpen();
        setLoading(true);
        await axios
            .post(
                api.GET_PRODUCTS
                , {}
                , {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setProducts(
                    (res.data.metadata).filter(
                        (product) => (products.includes(product._id))
                    )
                );
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const getGroups = async () => {
        setGroups(items.filter(item => item.kind === 'aliconcon_groups'));
        onOpen();
        setLoading(true);
        await axios
            .post(
                api.GET_GROUPS
                , {}
                , {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                message.success(res.data.message);
                setProducts(
                    (res.data.metadata).filter(
                        (group) => (groups.includes(group._id))
                    )
                );
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    {/* Remove from group */}
    const removeItemFromVoucher = async (productId) => {
        setLoading(true);
        await axios
            .post(
                api.REMOVE_PRODUCT_FROM_VOUCHER,
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

    {/* Pagination control functions */}
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
    ];

    const onCloseModal = async () => {
        setData(null);
        onClose();
    }

    React.useEffect(() => {
        if(!data) return;
        getProducts();
        getGroups();
    }, [data]);

    React.useEffect(() => {
        createDataList();
    }, [products, groups, filter]);

    return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Items of this Voucher: </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Tabs>
                        <TabList>
                            <Tab>Products</Tab>
                            <Tab>Groups</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                            <Flex direction="column" gap={35}>
                                

                                {/* Add product to this voucher buttons */}
                                <HStack justify="flex-end" display={user && user.role < 4 ? 'flex' : 'none'}>
                                    <AddProductToVouModal groupId={group.id} />
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
                            </TabPanel>
                            <TabPanel>
                                <Flex direction="column" gap={35}>
                                    {/* Add group to this voucher buttons */}
                                    <HStack justify="flex-end" display={user && user.role < 4 ? 'flex' : 'none'}>
                                        <AddGroupToVouModal groupId={group.id} />
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
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onCloseModal} isLoading={loading}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

