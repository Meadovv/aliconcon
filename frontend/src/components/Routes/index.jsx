import Login from "../../pages/Login";
import Home from "../../pages/Home";
import Logout from "../../pages/Logout";
import Error from "../../pages/Error";

import Shop from "../../pages/Shop";
import Product from "../../pages/Product";

const routers = [
    {
        path: '/login',
        page: <Login />,
        header: false,
        footer: false,
        middleware: 'guest'
    },
    {
        path: '/register',
        page: null,
        header: false,
        footer: false,
        middleware: 'guest'
    },
    {
        path: '/',
        page: <Home />,
        header: true,
        footer: true,
        middleware: 'guest'
    },
    {
        path: '/logout',
        page: <Logout />,
        header: true,
        footer: true,
        middleware: 'private'
    },
    {
        path: '/shop/:shopId',
        page: <Shop />,
        header: true,
        footer: true,
        middleware: 'guest'
    },
    {
        path: '/product/:productId',
        page: <Product />,
        header: true,
        footer: true,
        middleware: 'guest'
    },
    {
        path: '*',
        page: <Error />,
        header: false,
        footer: false,
        middleware: 'guest'
    },
];

export default routers;