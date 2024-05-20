import {
    Box,
    Flex,
    HStack,
    Link,
    IconButton,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    Image,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { MdShoppingCart, MdSearch } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Links = ['home-page', 'for-seller-page', 'for-admin-page'];

const NavLink = ({ children }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}
    >
        {children}
    </Link>
);

export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label="Open Menu"
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Image boxSize="50px" objectFit="cover" src="/images/logo.png" alt="aliconcon-logo" />
                        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                            {Links.map((link, index) => (
                                <NavLink key={index}>{t(link)}</NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'} gap={2}>
                        <IconButton
                            rounded={'full'}
                            display={{ base: 'none', md: 'flex' }}
                            bg={useColorModeValue('blue.400', 'blue.800')}
                            color={useColorModeValue('white', 'gray.800')}
                            _hover={{
                                bg: 'blue.600',
                            }}
                            aria-label="search"
                            icon={<MdSearch />}
                        />
                        <IconButton
                            rounded={'full'}
                            display={{ base: 'none', md: 'flex' }}
                            bg={useColorModeValue('blue.400', 'blue.800')}
                            color={useColorModeValue('white', 'gray.800')}
                            _hover={{
                                bg: 'blue.600',
                            }}
                            aria-label="cart"
                            icon={<MdShoppingCart />}
                        />
                        <Menu>
                            <IconButton
                                as={MenuButton}
                                rounded={'full'}
                                bg={useColorModeValue('blue.400', 'blue.800')}
                                color={useColorModeValue('white', 'gray.800')}
                                _hover={{
                                    bg: 'blue.600',
                                }}
                                aria-label="user"
                                icon={<Icon as={FaUserCircle}/>}
                            />
                            <MenuList>
                                <MenuItem>{t('profile')}</MenuItem>
                                <MenuItem>{t('orders')}</MenuItem>
                                <MenuItem display={{ md: 'none' }}>{t('cart')}</MenuItem>
                                <MenuDivider />
                                <MenuItem>{t('logout')}</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link, index) => (
                                <NavLink key={index}>{t(link)}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}
