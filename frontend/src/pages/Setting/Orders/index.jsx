import { Table, Tag } from 'antd';
import React from 'react';

import { formatPrice } from '../../../utils/helpers';

const columns = [
    {
        title: 'OrderID',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'Paid',
        dataIndex: 'paid',
        key: 'paid',
        render: (text, record) => (<Tag color={record.paid ? 'blue' : 'red'}>{record.paid ? 'Paid' : 'Not Paid'}</Tag>)
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (<Tag color={record.status ? 'blue' : 'red'}>{record.status ? 'Delivered' : 'Shipping'}</Tag>)
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (text, record) => formatPrice(record.total)
    },
];

import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

export default function Orders() {

    const [data, setData] = React.useState([]);

    const getOrders = async () => {
        await axios.post(api.GET_ORDERS, {}, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            }
        })
        .then(res => {
            setData(res.data.metadata);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        getOrders();
    }, [])

    return (
        <Table columns={columns} dataSource={data} />
    );
}