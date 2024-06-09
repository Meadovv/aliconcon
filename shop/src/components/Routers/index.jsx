import Categories from '../../pages/Categories';
import Home from '../../pages/Home';
import Authentication from '../../pages/Authentication';
import Products from '../../pages/Products';
import Vouchers from '../../pages/Vouchers';
import Logout from '../../pages/Logout';
import Users from '../../pages/Users';
import Orders from '../../pages/Orders';
import Media from '../../pages/Media';

const routers = [
    {
        path: '/authentication',
        children: <Authentication />,
        layout: false,
        middleware: 'public'
    },
    {
        path: '/',
        children: <Home />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/logout',
        children: <Logout />,
        layout: false,
        middleware: 'private'
    },
    {
        path: '/products',
        children: <Products />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/categories',
        children: <Categories />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/vouchers',
        children: <Vouchers />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/medias',
        children: <Media />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/orders',
        children: <Orders />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '/users',
        children: <Users />,
        layout: true,
        middleware: 'private'
    },
    {
        path: '*',
        children: null,
        layout: false,
        middleware: 'private'
    },
];

export default routers;