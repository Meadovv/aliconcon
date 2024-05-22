import { Home, Product, Cart, Logout, Shop, Setting, Authentication, Checkout, Tracking, Forgot, Reset, Search } from '../../pages';

const routers = [
    {
        path: '/logout',
        component: <Logout />,
        middleware: true,
        layout: false,
    },
    {
        path: '/',
        component: <Home />,
        middleware: false,
        layout: true,
    },
    {
        path: '/product/:productId',
        component: <Product />,
        middleware: false,
        layout: true,
    },
    {
        path: '/shop/:shopId',
        component: <Shop />,
        middleware: false,
        layout: true,
    },
    {
        path: '/cart',
        component: <Cart />,
        middleware: false,
        layout: true,
    },
    {
        path: '/checkout',
        component: <Checkout />,
        middleware: false,
        layout: true,
    },
    {
        path: '/setting',
        component: <Setting />,
        middleware: true,
        layout: true,
    },
    {
        path: '/authentication',
        component: <Authentication />,
        middleware: false,
        layout: false,
    },
    {
        path: '/tracking',
        component: <Tracking />,
        middleware: false,
        layout: true,
    },
    {
        path: '/forgot-password',
        component: <Forgot />,
        middleware: false,
        layout: false,
    },
    {
        path: '/reset-password',
        component: <Reset />,
        middleware: false,
        layout: false,
    },
    {
        path: '/search',
        component: <Search />,
        middleware: false,
        layout: true,
    }
];

export default routers;
