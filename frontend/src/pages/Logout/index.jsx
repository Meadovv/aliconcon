import axios from "axios"
import { useEffect, useState } from "react"
import CONFIG from "../../configs"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { message } from "antd"
import { setUser } from "../../reducer/actions/user.slice"

export default function Logout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true);
        await axios.post(CONFIG.API + '/auth/logout', {}, {
            headers: {
                ['x-client-id']: localStorage.getItem('x-client-id'),
                ['x-token-id']: localStorage.getItem('x-token-id')
            }
        }).then(res => {
            message.success(res.data.message)
            localStorage.removeItem('x-client-id')
            localStorage.removeItem('x-token-id')
            dispatch(setUser(null))
            navigate('/')
        }).catch(err => {
            message(err.message);
            console.log(err)
        })
        setLoading(false);
    }

    useEffect(() => {
        logout()
    }, [])

    return (
        loading ? <div>Logging out...</div> : <div></div>
    )
}