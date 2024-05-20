import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';

const routers = [
    {
        path: '/login',
        children: <Login />,
        layout: false,
        middleware: 'public'
    },
    {
        path: '/register',
        children: <Register />,
        layout: false,
        middleware: 'public'
    },
    {
        path: '/',
        children: <Home />,
        layout: true,
        middleware: 'guest'
    },
    {
        path: '/logout',
        children: null,
        layout: false,
        middleware: 'private'
    },
    {
        path: '/shop/:shopId',
        children: null,
        layout: false,
        middleware: 'guest'
    },
    {
        path: '/product/:productId',
        children: null,
        layout: false,
        middleware: 'guest'
    },
    {
        path: '*',
        children: null,
        
        middleware: 'guest'
    },
];

export default routers;