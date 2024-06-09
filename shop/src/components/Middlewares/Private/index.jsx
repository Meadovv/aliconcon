import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuth, removeAuth } from '../../../reducer/actions/auth.slice';
import axios from 'axios';
import api from '../../../apis';
import { message } from 'antd';

import { useNavigate } from 'react-router-dom';

const Private = () => {
    const { user, shop } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const getMetadata = async () => {
        if (!localStorage.getItem('token') || !localStorage.getItem('client')) dispatch(removeAuth());
        else {
            await axios
                .post(
                    api.METADATA,
                    {},
                    {
                        headers: {
                            'x-token-id': localStorage.getItem('token'),
                            'x-client-id': localStorage.getItem('client'),
                        },
                    },
                )
                .then((res) => {
                    dispatch(setAuth(res.data.metadata));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(removeAuth());
                    localStorage.clear();
                    message.error(err.response.data.message);
                    navigate('/authentication');
                });
        }
    };

    React.useEffect(() => {
        if ((!user) || (!shop)) getMetadata();
    }, [user, shop, getMetadata]);

    React.useEffect(() => {
        if ((!user) || (!shop)) getMetadata();
    }, []);

    return localStorage.getItem('token') && localStorage.getItem('client') ? <Outlet /> : <Navigate to={'/authentication'} />;
};

export default Private;
