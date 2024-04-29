import Login from "../../pages/Login";
import Home from "../../pages/Home";
import Logout from "../../pages/Logout";
import Error from "../../pages/Error";

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
        path: '*',
        page: <Error />,
        header: false,
        footer: false,
        middleware: 'guest'
    },
];

export default routers;