import React from 'react';
import './index.css';
import axios from 'axios';
import api from '../../../apis';

import { message, Table, Tag } from 'antd';
import { Button } from '@chakra-ui/react';

import AddAddressModal from '../../../components/Modal/AddAddress';

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
                    <Tag color="blue" style={{ display: defaultAddress === record.key ? '' : 'none', marginLeft: 10 }}>
                        Default
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 300,
            render: (text, record) => (
                <div
                    style={{
                        display: defaultAddress === record.key ? 'none' : 'flex',
                        gap: 10,
                    }}
                >
                    <Button colorScheme="orange" onClick={() => onSet(record.key)}>
                        Default
                    </Button>
                    <Button colorScheme="red" onClick={() => onRemove(record.key)}>
                        Remove
                    </Button>
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
        await axios.post(api.SET_DEFAULT_ADDRESS, {
            index: index,
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        })
        .then(res => {
            message.success(res.data.message);
            getUser();
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    };

    const removeAddress = async (index) => {
        await axios.post(api.REMOVE_ADDRESS, {
            index: index,
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        })
        .then(res => {
            message.success(res.data.message);
            getUser();
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    };

    const setAddressList = ({ addressList, defaultAddress }) => {
        setUser({
            ...user,
            address: addressList,
            default_address: defaultAddress,
        })
    }

    React.useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <div className="_profile-container">
                <div className="_profile-item">
                    <div className="left-side">
                        <div className="title">Address</div>
                    </div>

                    <div className="right-side">
                        <AddAddressModal setAddressList={setAddressList}/>
                    </div>
                </div>
            </div>
            <AddressTable
                dataSource={user?.address}
                defaultAddress={user?.default_address}
                onSet={setDefaultAddress}
                onRemove={removeAddress}
            />
        </>
    );
}
