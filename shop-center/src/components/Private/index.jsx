import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios'
import CONFIG from '../../configs';
import Error from '../../pages/Error';
import { setAuth, selectShop } from '../../reducer/actions/auth.slice';

function Private({ children }) {
    const shop = useSelector(selectShop)
    const dispatch = useDispatch()

    // Reload shop
    const getUser = async () => {
        await axios.post(CONFIG.API + '/access/shop/metadata'
        , {}
        , {
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
        if(localStorage.getItem('x-client-id') && localStorage.getItem('x-token-id')){
            if(!shop) getUser();
            else {
                console.log(shop);
                return children;
            }
        }
        
    }, [shop])

    return <Error error={CONFIG.ERROR.NEED_LOGIN}/>
}

export default Private;