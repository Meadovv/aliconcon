const routers = [
    {
        path: '/login',
        page: null,
        middleware: 'guest'
    },
    {
        path: '/register',
        page: null,
        middleware: 'guest'
    },
    {
        path: '/',
        page: null,
        middleware: 'guest'
    },
    {
        path: '/logout',
        page: null,
        middleware: 'private'
    },
    {
        path: '/shop/:shopId',
        page: null,
        middleware: 'guest'
    },
    {
        path: '/product/:productId',
        page: null,
        middleware: 'guest'
    },
    {
        path: '*',
        page: null,
        middleware: 'guest'
    },
];

export default routers;