import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react';
import React from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

export default function SignupCard() {
    const [showPassword, setShowPassword] = React.useState(false);
    const { t } = useTranslation();

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'2xl'} textAlign={'center'}>
                        {t('signup-welcome')}
                    </Heading>
                </Stack>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Stack spacing={4}>
                        <FormControl id="name" isRequired>
                            <FormLabel>{t('name')}</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="email" isRequired>
                            <FormLabel>{t('email')}</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password" isRequired>
                            <FormLabel>{t('password')}</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}
                                    >
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <FormControl id="address" isRequired>
                            <FormLabel>{t('address')}</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <FormControl id="phone" isRequired>
                            <FormLabel>{t('phone')}</FormLabel>
                            <Input type="text" />
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Submitting"
                                size="lg"
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}
                                aria-label='signup'
                            >
                                {t('signup')}
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                {t('already-have-account')}{' '}
                                <Link color={'blue.400'} href="/login">
                                    {t('signin')}
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
