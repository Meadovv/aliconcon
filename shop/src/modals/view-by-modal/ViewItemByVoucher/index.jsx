import { 
    HStack, Button, Flex, Box, Image, useDisclosure, Modal, Tabs, TabList, TabPanel, TabPanels, Tab,
    ModalBody, ModalCloseButton, ModalContent, ModalOverlay, ModalHeader, ModalFooter, Spinner
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { useSelector, } from 'react-redux';

import { Table, Space, Select, message, Input, Popconfirm } from 'antd';

import axios from 'axios';
import api from '../../../apis';

export default function ViewItemByVouModal({resetVoucher, voucherId, data, setData}) {
    
    const user = useSelector((state) => state.auth.user);

    const { isOpen, onOpen, onClose } = useDisclosure();

    {/* States */}
    const [recordPerPage, setRecordPerPage] = React.useState(10);
    const [currentPage, setCurrentPage] = React.useState(1);

    const [productIdList, setProductIdList] = React.useState([]);
    const [groupIdList, setGroupIdList] = React.useState([]);

    const [products, setProducts] = React.useState([]);
    const [groups, setGroups] = React.useState([]);

    const [productList, setProductList] = React.useState([]);
    const [groupList, setGroupList] = React.useState([]);

    const [loading, setLoading] = React.useState(false);

    const [filter, setFilter] = React.useState({
        addBy: null,
        name: null,
    });

    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);

    {/* Data functions*/}
    const createDataList = () => {
        let tempList = [];
            if(data){
                
            
            {/* Product list filter */}
            setProductIdList(data.filter(item => item.kind === 'aliconcon_products').map(item => item.item));
            products
            .filter(
                (product) => (productIdList.includes(product._id))
            )       
            .filter((product) =>
                (filter.addBy ? product.addBy.name.includes(filter.addBy) : true) &&
                (filter.name ? product.name.includes(filter.name) : true),
            )
            .forEach((product, index) => {
                tempList.push({
                    key: index,
                    _id: product._id,
                    name: product.name,
                    addBy: product.addBy.name,
                    kind: 'product',
                });
            });
            setProductList(tempList);

            tempList = [];

            {/* Group list filter */}
            setGroupIdList(data.filter(item => item.kind === 'aliconcon_groups').map(item => item.item));
            groups
            .filter(
                (group) => (groupIdList.includes(group._id))
            )  
            .filter((group) =>
                (filter.addBy ? group.addBy.name.includes(filter.addBy) : true) &&
                (filter.name ? group.name.includes(filter.name) : true),
            )
            .forEach((group, index) => {
                tempList.push({
                    key: index,
                    _id: group._id,
                    name: group.name,
                    addBy: group.addBy.name,
                    kind: 'group',
                });
            });
            setGroupList(tempList);    
        }        
    };

    const getGroups = async () => {
        setLoading(true);
        await axios.post(
            api.GET_PRODUCTS
            ,{}
            ,{
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

    const getProducts = async () => {
        setLoading(true);
        await axios.post(
            api.GET_GROUPS
            ,{}
            ,{
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

    {/* Remove from voucher */}
    const removeItemFromVoucher = async ({id, type}) => {
        setLoading(true);
        await axios.post(
            api.REMOVE_FROM_VOUCHER,
            { 
                itemType: type,
                voucherId: voucherId, 
                itemId: id, 
            },
            {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                },
            }
        )
        .then((res) => {
            message.success(res.data.message);
            resetVoucher();
        })
        .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        });
        setLoading(false);
    };

    {/* Search functions */}
    const handleSearchProduct = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearchQuery(query);

        const filteredProducts = 
        products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredProducts);
        setLoading(false);
    };

    {/* Search functions */}
    const handleSearchGroup = (e) => {
        setLoading(true);
        const query = e.target.value;
        setSearchQuery(query);

        const filteredGroups = groups.filter(group =>
            group.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filteredGroups);
        setLoading(false);
    };

    const handleSearchResultClick = async ({type, id}) => {
        setLoading(true);
        await axios.post(
            api.ADD_TO_VOUCHER,
            { 
                itemType: type,
                voucherId: voucherId, 
                itemId: id, 
            },
            {
                headers: {
                    'x-client-id': localStorage.getItem('client'),
                    'x-token-id': localStorage.getItem('token'),
                },
            }
        )
        .then((res) => {
            message.success(res.data.message);
            resetVoucher();
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
            title: 'Added By',
            dataIndex: 'addBy',
            key: 'addedBy',
            responsive: ['md'], // This column will be hidden on screens smaller than md
        },
    ];

    if (user && user.role < 3) {
        columns.push({
            title: 'Quick Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    {/* Remove from voucher options */}
                    <Popconfirm
                        title={'Are you sure you want to remove this from the voucher ?'}
                        onConfirm={
                            () => removeItemFromVoucher({id: record._id, type: record.kind})
                        }
                        okText={'Remove'}
                        cancelText="No"
                        okButtonProps={{size: 'large',}}
                        cancelButtonProps={{size: 'large',}}
                        overlayStyle={{ zIndex: 2000 }}
                    >
                        <Button colorScheme={'red'}>
                            {'Remove from the voucher'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        });
    }

    const onCloseModal = async () => {
        setData(null);
        onClose();
    }

    React.useEffect(() => {
        if(!data) return;
        console.log(data);
        onOpen();
        getProducts();
        getGroups();
    }, [data]);

    React.useEffect(() => {
        createDataList();
    }, [products, groups, filter]);

    return (

        <Modal isOpen={isOpen} onClose={onCloseModal} size={''}>
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

                            {/* Product panel */}
                            <TabPanel>
                            <Flex direction="column" gap={35}>

                                {/* Add product to this voucher */}
                                <HStack justify="flex-end" display={user && user.role < 3 ? 'flex' : 'none'}>
                                    <Flex direction="column" gap={4}>
                                        <Input
                                            placeholder="Search products to add in..."
                                            value={searchQuery}
                                            onChange={handleSearchProduct}
                                            isDisabled={loading}
                                            isLoading={loading}
                                        />
                                        {loading && <Spinner />}
                                        {searchResults.length > 0 && searchQuery && (
                                            <Box bg="white" boxShadow="md" rounded="md" mt={2} p={2} maxHeight="200px" overflowY="auto">
                                                {searchResults.map(product => (
                                                    <Box
                                                        key={product._id}
                                                        p={2}
                                                        borderBottom="1px solid"
                                                        borderColor="gray.200"
                                                        cursor="pointer"
                                                        onClick={() => handleSearchResultClick({type: 'product', id: product._id})}
                                                    >
                                                        {product.name}
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Flex>
                                </HStack>

                                {/* The actual table */}
                                <Table
                                    loading={loading}
                                    columns={columns}
                                    dataSource={productList}
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
                                                    placeholder="Added by"
                                                    onChange={(e) => setFilter({ ...filter, addBy: e.target.value })}
                                                    value={filter.addBy}
                                                />
                                            </HStack>
                                        </Flex>
                                    )}
                                />
                            </Flex>
                            </TabPanel>

                            {/* Group panel */}
                            <TabPanel>
                                <Flex direction="column" gap={35}>
                                    {/* Add group to this voucher */}
                                    <HStack justify="flex-end" display={user && user.role < 3 ? 'flex' : 'none'}>
                                        <Flex direction="column" gap={4}>
                                            <Input
                                                placeholder="Search groups to add in..."
                                                value={searchQuery}
                                                onChange={handleSearchGroup}
                                                isDisabled={loading}
                                                isLoading={loading}
                                            />
                                            {loading && <Spinner />}
                                            {searchResults.length > 0 && searchQuery && (
                                                <Box bg="white" boxShadow="md" rounded="md" mt={2} p={2} maxHeight="200px" overflowY="auto">
                                                    {searchResults.map(product => (
                                                        <Box
                                                            key={product._id}
                                                            p={2}
                                                            borderBottom="1px solid"
                                                            borderColor="gray.200"
                                                            cursor="pointer"
                                                            onClick={() => handleSearchResultClick({type: 'group', id: product._id})}
                                                        >
                                                            {product.name}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            )}
                                        </Flex>
                                    </HStack>

                                    {/* The actual table */}
                                    <Table
                                        loading={loading}
                                        columns={columns}
                                        dataSource={groupList}
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
                                                        placeholder="Added by"
                                                        onChange={(e) => setFilter({ ...filter, addBy: e.target.value })}
                                                        value={filter.addBy}
                                                    />
                                                </HStack>
                                            </Flex>
                                        )}
                                    />
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

