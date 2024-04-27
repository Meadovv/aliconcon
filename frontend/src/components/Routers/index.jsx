// import { Home, Product, Cart, Search } from '../../pages';

import { Home, Product } from '../../pages';

const routers = [
    {
        path: '/',
        component: <Home />,
        middleware: false,
        layout: true,
    },
    {
        path: '/product/:id',
        component: <Product />,
        middleware: false,
        layout: true,
    },
    // {
    //     path: '/cart',
    //     component: <Cart />,
    //     middleware: false,
    // },
    // {
    //     path: '/search/:searchTerm',
    //     component: <Search />,
    //     middleware: false,
    // }
]

export default routers;