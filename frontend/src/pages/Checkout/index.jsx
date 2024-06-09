import { Box, VStack, HStack, Text, Button } from '@chakra-ui/react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice } from '../../utils/helpers';

import { openModal } from '../../reducer/actions/modal.slice';

export default function Checkout() {
    const dispatch = useDispatch();
    const { carts, itemCount, total } = useSelector((state) => state.cart);
    const shippingFee = 30000;

    return (
        <Box display="flex" flexDirection="column" h="full" p={5} className="container my-2">
            <div
                className="header"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '1rem',
                    borderRadius: '5px',
                }}
            >
                Checkout
            </div>

            <div>
                <Text fontSize="xl" mb={3}>
                    Items
                </Text>
                {carts &&
                    carts.map((cart, index) => {
                        const newPrice = cart.variation.price - (cart.variation.price * cart.product.sale) / 100;
                        return (
                            <div
                                style={{
                                    backgroundColor: '#F2F2F2',
                                    borderRadius: '5px',
                                    marginBottom: '1rem',
                                    padding: '1rem',
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
                                            {cart.product.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                            }}
                                        >
                                            {cart.variation.name}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <div style={{
                                            fontWeight: 700,
                                        }}>{formatPrice(newPrice)}</div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            x {cart.quantity}
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
                                    <div>{formatPrice(newPrice * cart.quantity)}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            <Box borderRadius="md" flex="1">
                <Text fontSize="xl" mb={3}>
                    Payment
                </Text>
                <VStack align="end">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}
                    >
                        <div>Items Fee</div>
                        <div>{formatPrice(total)}</div>
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
                                color: '#F94E30',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                            }}
                        >
                            {formatPrice(total + shippingFee)}
                        </div>
                    </div>
                    <Button colorScheme="red" onClick={() => dispatch(openModal({ modal: 'payment' }))}>Pay Now</Button>
                </VStack>
            </Box>
        </Box>
    );
}
