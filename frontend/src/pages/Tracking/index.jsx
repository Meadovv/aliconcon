import React from 'react';
import { Input, Button, VStack, Text, Box } from '@chakra-ui/react';
import { formatPrice } from '../../utils/helpers';
import { useSearchParams, useNavigate } from 'react-router-dom';

import Loader from '../../components/Loader';

import './index.css';

import { message } from 'antd';

import axios from 'axios';
import api from '../../apis';

export default function Tracking() {
    const [orderID, setOrderID] = React.useState('');
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [searchParams, setSearchParams] = useSearchParams('');
    const navigate = useNavigate();

    const shippingFee = 30000;

    const getTracking = async () => {
        setLoading(true);
        await axios
            .get(api.GET_TRACKING({ id: orderID }))
            .then((res) => {
                setOrder(res.data.metadata);
                message.success(res.data.message);
            })
            .catch((err) => {
                setOrder(null);
                console.log(err);
                message.error(err.response.data.message);
            });
        setLoading(false);
    };

    const handleInputChange = (event) => {
        setOrderID(event.target.value);
    };

    React.useEffect(() => {
        const tempOrderID = searchParams.get('orderId');
        console.log(tempOrderID);
        if (tempOrderID) {
            setOrderID(tempOrderID);
            getTracking();
        }
    }, [])

    React.useEffect(() => {
        if(order?._id) navigate('/tracking?orderId=' + order?._id);
        else navigate('/tracking');
    }, [order])

    return (
        <div className="container my-5">
            <VStack spacing={3} align="center">
                <Input type="text" value={orderID} onChange={handleInputChange} placeholder="Enter Order ID" />
                <Button colorScheme="orange" onClick={getTracking}>
                    Track Your Order
                </Button>
            </VStack>

            {loading ? (
                <Loader />
            ) : order ? (
                <>
                    <div className="_Tracking_header">Receiver's Information</div>

                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <div className="_Tracking_item-list">
                            <div className="_Tracking_item-label">Name</div>
                            <div className="_Tracking_item-content">{order?.user_name}</div>
                        </div>

                        <div className="_Tracking_item-list">
                            <div className="_Tracking_item-label">Phone</div>
                            <div className="_Tracking_item-content">{order?.user_phone}</div>
                        </div>

                        <div className="_Tracking_item-list">
                            <div className="_Tracking_item-label">Address</div>
                            <div className="_Tracking_item-content">{order?.user_address}</div>
                        </div>
                    </div>

                    <div className="_Tracking_header">Items</div>

                    <VStack width="100%">
                        {order?.items &&
                            order?.items.map((item, index) => {
                                const newPrice =
                                    item.variation.price - (item.variation.price * item.product.sale) / 100;
                                return (
                                    <div
                                        style={{
                                            backgroundColor: '#F2F2F2',
                                            borderRadius: '5px',
                                            marginBottom: '1rem',
                                            padding: '1rem',
                                            width: '100%',
                                        }}
                                        key={index}
                                    >
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: '1rem',
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {item.product.name}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        fontStyle: 'italic',
                                                    }}
                                                >
                                                    {item.variation.name}
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {formatPrice(newPrice)}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                >
                                                    x {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <hr
                                            style={{
                                                width: '100%',
                                                height: '1px',
                                                backgroundColor: 'gray',
                                                border: 'none',
                                                margin: '1rem 0',
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                color: '#F94E30',
                                                fontWeight: 700,
                                                fontSize: '1.2rem',
                                            }}
                                        >
                                            <div>Total</div>
                                            <div>{formatPrice(newPrice * item.quantity)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                    </VStack>

                    <div className="_Tracking_header">Payment Information</div>

                    <VStack align="end">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <div>Items Fee</div>
                            <div>{formatPrice(order?.total)}</div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <div>Shipping Fee</div>
                            <div>{formatPrice(shippingFee)}</div>
                        </div>
                        <hr
                            style={{
                                width: '100%',
                                height: '1px',
                                backgroundColor: 'gray',
                                border: 'none',
                                margin: '1rem 0',
                            }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                            }}
                        >
                            <div
                                style={{
                                    color: '#F94E30',
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                }}
                            >
                                Total Fee
                            </div>
                            <div
                                style={{
                                    position: 'relative', // make this a positioned element
                                    fontWeight: 700,
                                    fontSize: '1.2rem',
                                }}
                            >
                                <div
                                    style={{
                                        color: order?.paid === 1 ? '#000' : '#F94E30', // change color to black if paid
                                        opacity: order?.paid === 1 ? 0.4 : 1, // make text semi-transparent if paid
                                    }}
                                >
                                    {formatPrice(order?.total + shippingFee)}
                                </div>
                                {order?.paid === 1 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            border: '2px solid #F94E30',
                                            padding: '5px',
                                            width: '100px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            borderRadius: '5px',
                                            backgroundColor: 'transparent',
                                            color: '#F94E30',
                                            transform: 'rotate(-30deg)',
                                        }}
                                    >
                                        PAID
                                    </div>
                                )}
                            </div>
                        </div>
                        {order?.paid !== 1 && (
                            <Button colorScheme="red" onClick={() => dispatch(openModal({ modal: 'payment' }))}>
                                Pay Now
                            </Button>
                        )}
                    </VStack>
                </>
            ) : null}
        </div>
    );
}
