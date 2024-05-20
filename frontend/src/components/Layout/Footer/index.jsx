import {
    Image,
    Box,
    chakra,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    VisuallyHidden,
    Input,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import { BiMailSend } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';

const Logo = (props) => {
    return <Image boxSize="50px" objectFit="cover" src="/images/logo.png" alt="aliconcon-logo" />;
};

const SocialButton = ({ children, label, href }) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
            }}
            aria-label='social-media-link'
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const ListHeader = ({ children }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};

export default function LargeWithNewsletter() {
    const { t } = useTranslation();
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} maxW={'8xl'} py={10}>
                <SimpleGrid templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 2fr 3fr' }} spacing={10}>
                    <Stack align={'flex-start'}>
                        <ListHeader>{t('stay-up-to-date')}</ListHeader>
                        <Stack direction={'row'}>
                            <Input
                                placeholder={t('your-email-address')}
                                bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                                border={0}
                                _focus={{
                                    bg: 'whiteAlpha.300',
                                }}
                            />
                            <IconButton
                                bg={useColorModeValue('blue.400', 'blue.800')}
                                color={useColorModeValue('white', 'gray.800')}
                                _hover={{
                                    bg: 'blue.600',
                                }}
                                aria-label="Subscribe"
                                icon={<BiMailSend />}
                            />
                        </Stack>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Aliconcon</ListHeader>
                        <Link href={'#'}>{t('for-seller-page')}</Link>
                        <Link href={'#'}>{t('for-admin-page')}</Link>
                        <Link href={'#'}>{t('aliconcon-pay')}</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>{t('support')}</ListHeader>
                        <Link href={'#'}>{t('about-us')}</Link>
                        <Link href={'#'}>{t('help-center')}</Link>
                        <Link href={'#'}>{t('terms-of-service')}</Link>
                        <Link href={'#'}>{t('privacy-policy')}</Link>
                        <Link href={'#'}>{t('shipping-policy')}</Link>
                    </Stack>
                    <Stack spacing={6}>
                        <Box>
                            <Logo color={useColorModeValue('gray.700', 'white')} />
                        </Box>
                        <Text fontSize={'sm'}>{t('all-rights-reserved')}</Text>
                        <Stack direction={'row'} spacing={6}>
                            <SocialButton label={'Twitter'} href={'#'}>
                                <FaTwitter />
                            </SocialButton>
                            <SocialButton label={'YouTube'} href={'#'}>
                                <FaYoutube />
                            </SocialButton>
                            <SocialButton label={'Instagram'} href={'#'}>
                                <FaInstagram />
                            </SocialButton>
                            <SocialButton label={'Facebook'} href={'#'}>
                                <FaFacebook />
                            </SocialButton>
                        </Stack>
                    </Stack>
                </SimpleGrid>
            </Container>
        </Box>
    );
}
