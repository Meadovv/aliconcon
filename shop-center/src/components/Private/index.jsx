import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios'
import CONFIG from '../../configs';
import Error from '../../pages/Error';
import { selectShop } from '../../reducer/actions/auth.slice';

function Private({ children }) {
    const shop = useSelector(selectShop)
    const dispatch = useDispatch()

    const getUser = async () => {
        await axios.post(CONFIG.API + '/auth/shop/get', {}, {
            headers: {
                'x-client-id': localStorage.getItem('x-client-id'),
                'x-token-id': localStorage.getItem('x-token-id')
            }
        })
        .then(response => {
            dispatch(setAuth(response.data.metadata))
        })
        .catch(err => {
            console.log(err)
            localStorage.clear();
        })
    }

    useEffect(() => {
        if(!shop) getUser();
    }, [shop])

    if(shop) return children;
    return <Error error={CONFIG.ERROR.NEED_LOGIN}/>
}

export default Private;