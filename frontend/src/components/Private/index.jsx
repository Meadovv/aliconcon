import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../reducer/actions/user.slice';

import axios from 'axios'
import CONFIG from '../../configs';
import Error from '../../pages/Error';

function Private({ needLogin, children }) {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const getUser = async () => {
        await axios.post(CONFIG.API + '/auth/user/get', {}, {
            headers: {
                'x-client-id': localStorage.getItem('x-client-id'),
                'x-token-id': localStorage.getItem('x-token-id')
            }
        })
        .then(response => {
            if(response.status === 200) {
                dispatch(setUser(response.data.metadata))
            }
        })
    }

    useEffect(() => {
        if(!user) getUser();
    }, [user])

    if(needLogin) {
        if(user) return children;
        else {
            return <Error error={CONFIG.ERROR.NEED_LOGIN}/>
        }
    }

    return children;
}

export default Private;
