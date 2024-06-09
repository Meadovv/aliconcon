import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChakraProvider, Box, Heading, Text, Container } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth, removeAuth } from '../../reducer/actions/auth.slice';
import axios from 'axios';

import api from '../../apis';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function ShopOwnerDashboard() {

    const [shopName, setShopName] = useState('');
    const [userName, setUserName] = useState('');

    const user = useSelector((state) => state.auth.user);
    const shop = useSelector((state) => state.auth.shop);   

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getMetadata = async () => {
    
        await axios
            .post(
                api.METADATA,
                {},
                {
                    headers: {
                        'x-token-id': localStorage.getItem('token'),
                        'x-client-id': localStorage.getItem('client'),
                    },
                },
            )
            .then((res) => {
                dispatch(setAuth(res.data.metadata));
                setShopName(res.data.metadata.shop.name);
                setUserName(res.data.metadata.user.name);
            })
            .catch((err) => {
                console.log(err);
                dispatch(removeAuth());
                localStorage.clear();
                message.error(err.response.data.message);
                navigate('/authentication');
            });
        
    };

    // Sample data for the chart
    const data = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [
            {
                label: 'Orders   ',
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Income   ', 
                data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100)),
                borderColor: 'rgba(192, 100, 1, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Order Numbers in the Last Month',
            },
        },
    };

    React.useEffect(() => {
        getMetadata();
    }, []);

    return (
        <ChakraProvider>
            <Container maxW="container.xl" p={4}>
                <Box textAlign="center" mb={8}>
                    <Heading as="h1" size="2xl">{shopName}</Heading>
                    <Text fontSize="xl">Admin: {userName}</Text>
                </Box>
                <Box>
                    <Heading as="h3" size="lg" mb={4}>Orders in the Last Month</Heading>
                    <Line data={data} options={options} />
                </Box>
            </Container>
        </ChakraProvider>
    );
};
