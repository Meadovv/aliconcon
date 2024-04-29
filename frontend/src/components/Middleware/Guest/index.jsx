import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../reducer/actions/user.slice';

import axios from 'axios'
import CONFIG from '../../../configs';

import { setLoader } from '../../../reducer/actions/loader.slice';

function Guest({ children }) { // Người dùng đã đăng nhập mới có thể truy cập
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const getUser = async () => {
        dispatch(setLoader(true))
        await axios.post(CONFIG.API + '/access/user/metadata', {}, {
            headers: {
                'x-client-id': localStorage.getItem('x-client-id'),
                'x-token-id': localStorage.getItem('x-token-id')
            }
        })
        .then(response => {
            dispatch(setUser(response.data.metadata))
        })
        .catch(err => {
            console.log(err)
            localStorage.clear();
        })
        dispatch(setLoader(false))
    }

    useEffect(() => {
        if(!user?._id) getUser();
    }, [user])

    return children;
}

export default Guest;