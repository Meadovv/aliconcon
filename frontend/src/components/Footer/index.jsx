import { Layout } from 'antd';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { Form, Input, Button } from 'antd';

export default function Footer() {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    return (
        <Layout.Footer style={{
            backgroundColor: '#f8f9fa',
        }}>
            <div className="container">
                <footer className="py-5">
                    <div className="row justify-content-between">
                        <div className="col-6 col-md-2 mb-3">
                            <h5>Về Aliconcon</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    Giới thiệu về Aliconcon
                                </li>
                                <li className="nav-item mb-2">
                                    Chính sách bảo mật
                                </li>
                                <li className="nav-item mb-2">
                                    Chính sách bảo hành
                                </li>
                                <li className="nav-item mb-2">
                                    Điều khoản sử dụng
                                </li>
                                <li className="nav-item mb-2">
                                    Chăm sóc khách hàng
                                </li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-2 mb-3">
                            <h5>Theo dõi chúng tôi</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <FaFacebook /> Facebook
                                </li>
                                <li className="nav-item mb-2">
                                    <FaInstagram /> Instagram
                                </li>
                                <li className="nav-item mb-2">
                                    <FaTwitter /> Twitter
                                </li>
                                <li className="nav-item mb-2">
                                    <FaYoutube /> Youtube
                                </li>
                                <li className="nav-item mb-2">
                                    <FaLinkedin /> LinkedIn
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-5 offset-md-1 mb-3 border p-3 rounded bg-white">
                            <h5>Liên hệ</h5>
                            <Form layout="vertical" onFinish={onFinish}>
                                <Form.Item
                                    name="contact_form_name"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input placeholder="Họ và tên" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="contact_form_email"
                                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ hòm thư!' }]}
                                >
                                    <Input placeholder="Thư điện tử" size="large" />
                                </Form.Item>
                                <Form.Item name="contact_form_title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                                    <Input placeholder="Tiêu đề" size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="contact_form_content"
                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                                >
                                    <Input.TextArea placeholder="Nội dung" size="large" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" size='large' block>
                                    Gửi
                                </Button>
                            </Form>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                        <p>© 2024 Aliconcon, Inc. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </Layout.Footer>
    );
}
