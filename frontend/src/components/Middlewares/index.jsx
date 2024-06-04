import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

import axios from 'axios';
import api from '../../apis';

import { setUser } from '../../reducer/actions/user.slice';

import { restoreCart } from '../../reducer/actions/cart.slice';

export default function Middlewares({ middleware }) {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch();

    const getUser = async () => {
        const token = localStorage.getItem('token');
        const client = localStorage.getItem('client');
        if(!token || !client) {

        } else {
            await axios.post(api.METADATA, {}, {
                headers: {
                    'x-token-id': token,
                    'x-client-id': client
                }
            })
            .then((response) => {
                dispatch(setUser(response.data.metadata.user));
            })
            .catch((error) => {
                console.error(error);
                localStorage.clear();
            });
        }
    }

    const getCart = async (userId) => {
        const cartJSON = localStorage.getItem('carts');
        if(cartJSON) dispatch(restoreCart({ carts: JSON.parse(cartJSON) }));
    }

    React.useEffect(() => {
        getUser();
        getCart(user?._id);
    }, [user, getUser])

    if(middleware) return localStorage.getItem('token') && localStorage.getItem('client') ? null : <Navigate to='/login' />
    else return null;
}