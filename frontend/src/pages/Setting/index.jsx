import { Box, Flex, VStack, Button } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const menus = ['Profile', 'Orders', 'Advantage'];

import Profile from './Profile';
import Orders from './Orders';
import Advantage from './Advantage';

export default function Setting() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [selectedMenu, setSelectedMenu] = React.useState(0);

    const renderContent = () => {
        switch (selectedMenu) {
            case 0:
                return <Profile />;
            case 1:
                return <Orders />;
            case 2:
                return <Advantage />;
            default:
                return <Profile />;
        }
    }

    return (
        <Box p={5} className="container my-3">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '20px',
                    border: '1px solid #F94E30',
                    borderRadius: '5px',
                    marginBottom: '20px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}
                >
                    <div style={{
                        color: '#DC3545',
                        fontSize: '1.2rem',
                        fontWeight: 600
                    }}>{user?.name}</div>
                    <div>{user?.email}</div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '10px',
                    }}
                >
                    <Button colorScheme="red" onClick={() => navigate('/logout')}>Logout</Button>
                </div>
            </div>

            <Flex minHeight="50vh">
                <VStack borderRight="1px" borderColor="#F94E30" w="20%" pr={5} gap={5}>
                    {menus.map((menu, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: '10px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    color: selectedMenu === index ? 'white' : 'black',
                                    backgroundColor: selectedMenu === index ? '#F94E30' : 'white',
                                    minWidth: '150px',
                                    borderRadius: '5px',
                                }}
                                onClick={() => setSelectedMenu(index)}
                            >
                                {menu}
                            </div>
                        );
                    })}
                </VStack>

                <Box w="80%" pl={5}>
                    {renderContent()}
                </Box>
            </Flex>
        </Box>
    );
}
