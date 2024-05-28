import React from 'react';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Link,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Image,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiCompass, FiStar, FiSettings, FiMenu, FiBell, FiChevronDown, FiUser, FiArchive, FiPackage, FiSearch } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SidebarWithHeader({ children, layout }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box>
            {layout ? (
                <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                    <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
                    <Drawer
                        autoFocus={false}
                        isOpen={isOpen}
                        placement="left"
                        onClose={onClose}
                        returnFocusOnClose={false}
                        onOverlayClick={onClose}
                        size="full"
                    >
                        <DrawerContent>
                            <SidebarContent onClose={onClose} />
                        </DrawerContent>
                    </Drawer>
                    {/* mobilenav */}
                    <MobileNav onOpen={onOpen} />
                    <Box ml={{ base: 0, md: 60 }} p="4">
                        {children}
                    </Box>
                </Box>
            ) : (
                children
            )}
        </Box>
    );
}

const SidebarContent = ({ onClose, ...rest }) => {

    const user = useSelector(state => state.auth.user);
    
    const LinkItems = [
        { name: 'Home', icon: FiHome, link: '/', disabled: false },
        { name: 'SearchProduct', icon: FiSearch, link: '/search-product', disabled: false },
        { name: 'Categories', icon: FiArchive, link: '/categories', disabled: false },
        { name: 'Products', icon: FiPackage, link: '/products', disabled: false },
        { name: 'Vouchers', icon: FiStar, link: '/vouchers', disabled: false },
        { name: 'Users', icon: FiUser, link: '/users', disabled: user?.role > 2 },
        { name: 'Settings', icon: FiSettings, link: '/settings', disabled: user?.role > 1 },
    ];
    
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Image boxSize="50px" objectFit="cover" src="/images/logo.png" alt="aliconcon-logo" />
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Aliconcon
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} link={link.link} disabled={link.disabled}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, link, disabled, ...rest }) => {

    const navigate = useNavigate();
    
    return (
        <Link href={null} style={disabled ? { pointerEvents: 'none', opacity: '0.6' } : { textDecoration: 'none' }} _focus={{ boxShadow: 'none' }} onClick={() => navigate(link)}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'cyan.400',
                    color: 'white',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

const MobileNav = ({ onOpen, ...rest }) => {

    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const role = (idx) => {
        if(idx === 1) return 'Owner';
        if(idx === 2) return 'Admin';
        if(idx === 3) return 'Moderator';
        if(idx === 4) return 'Editor';
    }

    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}
        >
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                Aliconcon
            </Text>

            <HStack spacing={{ base: '0', md: '6' }}>
                <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2"
                                >
                                    <Text fontSize="sm">{user?.name}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {role(user?.role)}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <MenuItem>Profile</MenuItem>
                            <MenuItem>Settings</MenuItem>
                            <MenuItem>Billing</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={() => navigate('/logout')}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};
