import React from "react";
import axios from "axios";
import api from "../../apis";
import { useDispatch } from "react-redux";
import { removeAuth } from "../../reducer/actions/auth.slice";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function Logout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        await axios.post(api.LOGOUT, {}, {
            headers: {
                'x-token-id': localStorage.getItem('token'),
                'x-client-id': localStorage.getItem('client'),
            }
        })
        .then(res => {
            localStorage.clear();
            dispatch(removeAuth());
            message.success(res.data.message);
            navigate('/authentication');
        })
        .catch(err => {
            console.log(err);
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        logout();
    }, [])

    return (
        <div>
            Logging out...
        </div>
    );
}