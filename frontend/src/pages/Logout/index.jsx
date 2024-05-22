import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { setUser } from '../../reducer/actions/user.slice';
import { clearCart } from '../../reducer/actions/cart.slice';

import axios from 'axios';
import api from '../../apis';

export default function Logout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        await axios
            .post(
                api.LOGOUT,
                {},
                {
                    headers: {
                        'x-token-id': localStorage.getItem('token'),
                        'x-client-id': localStorage.getItem('client'),
                    },
                },
            )
            .then((response) => {
                message.success(response.data.message);
                dispatch(setUser(null));
                dispatch(clearCart());
                localStorage.clear();
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
                message.error(error.response.data.message);
            });
    };

    React.useEffect(() => {
        logout();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center my-5">Logging out...</h1>
                </div>
            </div>
        </div>
    );
}
