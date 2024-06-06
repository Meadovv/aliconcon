import React from 'react';
import { ChakraProvider, Box, Heading, Text, Container } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function ShopOwnerDashboard() {


    const shopName = 'shop.name';
    const adminName = 'user.name';

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

    return (
        <ChakraProvider>
            <Container maxW="container.xl" p={4}>
                <Box textAlign="center" mb={8}>
                    <Heading as="h1" size="2xl">{shopName}</Heading>
                    <Text fontSize="xl">Admin: {adminName}</Text>
                </Box>
                <Box>
                    <Heading as="h3" size="lg" mb={4}>Orders in the Last Month</Heading>
                    <Line data={data} options={options} />
                </Box>
            </Container>
        </ChakraProvider>
    );
};
