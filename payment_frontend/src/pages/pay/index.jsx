import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './index.css';

import { formatPrice } from '../../utils/helpers';

import { useToast } from '@chakra-ui/react';

const socket = io('http://localhost:3056');

export default function Pay() {
    const params = useParams();
    const [invoice, setInvoice] = React.useState(null);
    const [error, setError] = React.useState(null);

    const toast = useToast();

    const shippingFee = 30000;

    const getInvoice = async () => {
        await axios
            .post('http://localhost:3056/get', {
                invoiceId: params.invoiceId,
            })
            .then((res) => {
                setInvoice(res.data);
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.message);
            });
    };

    React.useEffect(() => {
        socket.on('connected', async (data) => {
            console.log(data);
            socket.emit('invoice', params.invoiceId);
            await getInvoice();
        });

        socket.on('verified', (data) => {
            console.log(data);
            toast({
                title: 'Payment successful',
                description: 'Your payment has been successfully processed.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        return () => socket.disconnect();
    }, []);

    return (
        <section className="payment-section">
            <div className="container">
                <div className="payment-wrapper">
                    <div className="payment-left">
                        <div className="payment-header">
                            <div className="payment-header-icon">
                                <i className="ri-flashlight-fill"></i>
                            </div>
                            <div className="payment-header-title">Order Summary</div>
                            <p className="payment-header-description">VAT included.</p>
                        </div>
                        <div className="payment-content">
                            <div className="payment-body">
                                <div className="payment-plan">
                                    <div className="payment-plan-type">ID</div>
                                    <div className="payment-plan-info">
                                        <div className="payment-plan-info-name">Order ID: {invoice?._id}</div>
                                        <div className="payment-plan-info-price">{invoice?.name}</div>
                                    </div>
                                </div>
                                <div className="payment-summary">
                                    <div className="payment-summary-item">
                                        <div className="payment-summary-name">Additional fee</div>
                                        <div className="payment-summary-price">$10</div>
                                    </div>
                                    <div className="payment-summary-item">
                                        <div className="payment-summary-name">Discount 20%</div>
                                        <div className="payment-summary-price">-$10</div>
                                    </div>
                                    <div className="payment-summary-item">
                                        <div className="payment-summary-name">Discount 20%</div>
                                        <div className="payment-summary-price">-$10</div>
                                    </div>
                                    <div className="payment-summary-divider"></div>
                                    <div className="payment-summary-item">
                                        <div className="payment-summary-name">Shipping Fee</div>
                                        <div className="payment-summary-price">{formatPrice(shippingFee)}</div>
                                    </div>
                                    <div
                                        className="payment-summary-item payment-summary-total"
                                        style={{ position: 'relative' }}
                                    >
                                        <div className="payment-summary-name">Total</div>
                                        <div
                                            className="payment-summary-price"
                                            style={{ opacity: invoice?.paid === 1 ? 0.5 : 1 }}
                                        >
                                            {formatPrice(invoice?.total + shippingFee)}
                                        </div>
                                        {invoice?.paid === 1 && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '0',
                                                    right: '10px',
                                                    width: '100px',
                                                    height: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: 'transparent',
                                                    border: '2px solid red',
                                                    borderRadius: '5px',
                                                    color: 'red',
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    rotate: '-30deg',
                                                    opacity: 1,
                                                }}
                                            >
                                                PAID
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: '#888',
                                            marginLeft: '10px',
                                            marginBottom: '10px',
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        *Remember Invoice ID to track your order
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="payment-right">
                        <form action="" className="payment-form">
                            <h1 className="payment-title">Payment QR</h1>
                            <div className="payment-method">
                                <img
                                    src="/images/qr.webp"
                                    alt=""
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
