import { List } from 'antd';
import { Button } from '@chakra-ui/react';
import React from 'react';

import axios from 'axios';
import api from '../../../apis';

import { message } from 'antd';
import { IMAGE_HOST } from '../../../apis';

import { formatPrice } from '../../../utils/helpers';

import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = React.useState([]);

    const getWishlist = async () => {
        await axios.post(api.GET_WISHLIST, {}, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client')
            }
        })
        .then(res => {
            const dataWithKey = res.data.metadata?.map((item, index) => ({
                ...item,
                key: index,
            }));
            setWishlist(dataWithKey);
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        getWishlist();
    }, [])

    return (
        <List
            itemLayout="horizontal"
            dataSource={wishlist}
            renderItem={product => (
                <List.Item
                    actions={[
                        <Button type="primary" onClick={() => navigate(`/product/${product._id}`)}>View</Button>
                    ]}
                >
                    <List.Item.Meta
                        avatar={<img src={IMAGE_HOST.THUMBNAIL(product?.thumbnail.name)} alt={product.name} style={{ width: '64px' }} />}
                        title={product.name}
                        description={`Price: ${formatPrice(product.price)}`}
                    />
                </List.Item>
            )}
        />
    );
}