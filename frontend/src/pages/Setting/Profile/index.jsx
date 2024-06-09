import React from 'react';
import './index.css';
import axios from 'axios';
import api from '../../../apis';

import { message, Table, Tag } from 'antd';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
} from '@chakra-ui/react';

const modalModes = [
    {
        title: 'Change Phone Number',
        field: 'phone',
        fieldLabel: 'Phone Number',
        fieldPlaceholder: 'Phone Number',
    },
    {
        title: 'Add Address',
        field: 'address',
        fieldLabel: 'Address',
        fieldPlaceholder: 'Address',
    },
];

function AddressTable({ dataSource, onSet, onRemove, defaultAddress }) {
    const columns = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
            width: 50,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text, record) => (
                <div>
                    {record.address}
                    <Tag color='blue' style={{ display: defaultAddress === record.key ? '' : 'none', marginLeft: 10 }}>Default</Tag>
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <div style={{
                    display: defaultAddress === record.key ? 'none' : 'flex',
                    gap: 10
                }}>
                    <Button colorScheme='orange' onClick={() => onSet(record.key)}>Default</Button>
                    <Button colorScheme='red' onClick={() => onRemove(record.key)}>Remove</Button>
                </div>
            ),
        },
    ];

    const data = dataSource?.map((address, index) => ({
        key: index,
        address: address,
    }));

    return <Table columns={columns} dataSource={data} />;
}

export default function Profile() {
    const [user, setUser] = React.useState(null);
    const [modalMode, setModalMode] = React.useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const getUser = async () => {
        await axios
            .post(
                api.GET_INFORMATION,
                {},
                {
                    headers: {
                        'x-client-id': localStorage.getItem('client'),
                        'x-token-id': localStorage.getItem('token'),
                    },
                },
            )
            .then((res) => {
                setUser(res.data.metadata);
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.message);
            });
    };

    const setDefaultAddress = async (index) => {

    }

    const removeAddress = async (index) => {

    }

    const updateProfile = async (field) => {

    }

    React.useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{modalModes[modalMode].title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>{modalModes[modalMode].fieldLabel}</FormLabel>
                            <Input placeholder={modalModes[modalMode].fieldPlaceholder} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant="ghost" onClick={() => updateProfile(modalMode[modalMode].field)}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className="_profile-container">
                <div className="_profile-item">
                    <div className="left-side">
                        <div className="title">Phone:</div>
                        <div className="content">{user?.phone}</div>
                    </div>

                    <div className="right-side">
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                setModalMode(0);
                                onOpen();
                            }}
                        >
                            Change
                        </Button>
                    </div>
                </div>

                <div className="_profile-item">
                    <div className="left-side">
                        <div className="title">Address</div>
                    </div>

                    <div className="right-side">
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                setModalMode(1);
                                onOpen();
                            }}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>
            <AddressTable dataSource={user?.address} defaultAddress={user?.default_address} onSet={setDefaultAddress} onRemove={removeAddress}/>
        </>
    );
}
