import axios from "axios"
import { useEffect } from "react"
import CONFIG from "../../configs"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { message } from "antd"
import { removeUser } from "../../reducer/actions/user.slice"
import { setLoader } from "../../reducer/actions/loader.slice"

export default function Logout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        dispatch(setLoader(true))
        await axios.post(CONFIG.API + '/access/logout', {}, {
            headers: {
                ['x-client-id']: localStorage.getItem('x-client-id'),
                ['x-token-id']: localStorage.getItem('x-token-id')
            }
        }).then(res => {
            message.success(res.data.message)
            localStorage.clear();
            dispatch(removeUser())
            navigate('/')
        }).catch(err => {
            message(err.message);
        })
        dispatch(setLoader(false))
    }

    useEffect(() => {
        logout()
    }, [])

    return null;
}