import React from 'react';
import './styles.css';
import axios from 'axios';
import api from '../../apis'
import {
    useSearchParams, useNavigate
} from 'react-router-dom';

import {
    message, Button
} from 'antd'

const modes = ['sign-up-mode', 'sign-in-mode'];
export default function Authentication() {

    const [mode, setMode] = React.useState(0);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loginForm, setLoginForm] = React.useState({
        shopEmail: '',
        email: '',
        password: ''
    })

    const [registerForm, setRegisterForm] = React.useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        shopName: '',
        shopEmail: '',
        shopAddress: '',
    })

    const [registerPhase, setRegisterPhase] = React.useState(0);

    const [loading, setLoading] = React.useState(false);

    const handle = async () => {
        setLoading(true);
        await axios.post(mode ? api.LOGIN : api.REGISTER, mode ? loginForm : registerForm)
        .then(res => {
            message.success(res.data.message);
            localStorage.setItem('token', res.data.metadata.token);
            localStorage.setItem('client', res.data.metadata.user._id);
            window.location.reload();
        })
        .catch(err => {
            message.error(err.response.data.message);
            console.log(err);
        })
        setLoading(false);
    }

    const changeMode = () => {
        setMode(prev => 1 - prev);
        navigate(`/authentication?mode=${modes[1 - mode]}`);
    }

    const checkInformation = async () => {
        setLoading(true);
        await axios.get(api.CHECK_MAIL + `?email=${registerForm.email}`)
        .then(res => {
            if(res.data.metadata) {
                setRegisterPhase(1);
            } else {
                message.error('Email already exists!')
            }
        })
        .catch(err => {
            message.error(err.response.data.message);
            console.log(err);
        })
        setLoading(false);
    }

    React.useEffect(() => {
        if(modes.includes(searchParams.get('mode'))) {
            setMode(modes.indexOf(searchParams.get('mode')))
        } else {
            navigate(`/authentication?mode=${modes[mode]}`);
        }
    }, [searchParams])

    return (
        <div className={`container ${modes[mode]}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form action="#" className="sign-in-form">
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <i className="fa-brands fa-shopify"></i>
                            <input type="email" placeholder="Shop Email" onChange={(e) => setLoginForm({...loginForm, shopEmail: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="email" placeholder="Email" onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}/>
                        </div>
                        <Button type='primary' size='large' onClick={handle} loading={loading} className='btn solid'>Login</Button>
                    </form>
                    <form action="#" className="sign-up-form" style={{
                        display: registerPhase ? 'none' : 'flex'
                    }}>
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Name" value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-phone"></i>
                            <input type="text" placeholder="Phone" value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-globe"></i>
                            <input type="text" placeholder="Address" value={registerForm.address} onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value})}/>
                        </div>
                        <Button type='primary' size='large' onClick={checkInformation} loading={loading} className='btn solid'>Continue</Button>
                    </form>

                    <form action="#" className="sign-up-form" style={{
                        display: registerPhase ? 'flex' : 'none'
                    }}>
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <i className="fa-brands fa-shopify"></i>
                            <input type="text" placeholder="Shop Name" value={registerForm.shopName} onChange={(e) => setRegisterForm({ ...registerForm, shopName: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-envelope"></i>
                            <input type="email" placeholder="Shop Email" value={registerForm.shopEmail} onChange={(e) => setRegisterForm({ ...registerForm, shopEmail: e.target.value})}/>
                        </div>
                        <div className="input-field">
                            <i className="fas fa-globe"></i>
                            <input type="text" placeholder="Shop Address" value={registerForm.shopAddress} onChange={(e) => setRegisterForm({ ...registerForm, shopAddress: e.target.value})}/>
                        </div>
                        <Button type='primary' size='large' onClick={handle} loading={loading} className='btn solid'>Sign In</Button>
                        <div className='btn-text' onClick={() => setRegisterPhase(0)}>Back</div>
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>New here ?</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis, ex ratione. Aliquid!</p>
                        <button className="btn transparent" onClick={() => changeMode()}>
                            Sign up
                        </button>
                    </div>
                    <img src="/images/login.svg" className="image" alt="login" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>One of us ?</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laboriosam ad deleniti.</p>
                        <button className="btn transparent" onClick={() => changeMode()}>
                            Sign in
                        </button>
                    </div>
                    <img src="/images/register.svg" className="image" alt="register" />
                </div>
            </div>
        </div>
    );
}
