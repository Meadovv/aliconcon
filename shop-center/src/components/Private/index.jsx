import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../reducer/actions/user.slice';

import axios from 'axios'
import CONFIG from '../../configs';
import Error from '../../pages/Error';

function Private({ children }) {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const getUser = async () => {
        await axios.post(CONFIG.API + '/access/shop/metadata', {}, {
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
    }

    useEffect(() => {
        if(!user) getUser();
    }, [user])

    if(user) return children;
    return <Error error={CONFIG.ERROR.NEED_LOGIN}/>
}

export default Private;