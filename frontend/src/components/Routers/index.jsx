// import { Home, Product, Cart, Search } from '../../pages';

import { Home, Product, Cart, Logout } from '../../pages';

const routers = [
    {
        path: '/logout',
        component: <Logout />,
        middleware: false,
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
        path: '/cart',
        component: <Cart />,
        middleware: false,
        layout: true
    },
    // {
    //     path: '/search/:searchTerm',
    //     component: <Search />,
    //     middleware: false,
    // }
]

export default routers;