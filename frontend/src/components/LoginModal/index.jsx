import { Modal, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
    LoginButton
} from './style';
import axios from 'axios';
import CONFIG from '../../configs';
import { useSelector, useDispatch } from 'react-redux';
import { switchModal } from '../../reducer/actions/login.slice';

export const LoginModal = () => {

    const { login } = useSelector((state) => state.login);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const Login = async (values) => {
        await axios.post(CONFIG.API + '/access/user/login', values)
        .then(res => {
            localStorage.setItem('x-client-id', res.data.metadata.user._id);
            localStorage.setItem('x-token-id', res.data.metadata.token);
            message.success(res.data.message);
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
            message.error(err.message)
        })
        closeModal();
    }

    const closeModal = () => {
        form.resetFields();
        dispatch(switchModal());
    }

    return (
        <Modal
            forceRender
            open={login}
            onCancel={() => closeModal()}
            footer={null}
        >
            <div>
                <h1>Đăng nhập</h1>
            </div>
            <Form
                onFinish={(values) => Login(values)}
                form={form}
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input placeholder="Email" size='large' />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input.Password placeholder="Password" size='large' />
                </Form.Item>
                <Form.Item>
                    <LoginButton type="primary" htmlType="submit" size='large'>
                        Log in
                    </LoginButton>
                </Form.Item>
                <Form.Item>
                    Don't have an account? <a onClick={() => navigate('/register')}>Register</a>
                </Form.Item>
            </Form>
        </Modal>
    )
}