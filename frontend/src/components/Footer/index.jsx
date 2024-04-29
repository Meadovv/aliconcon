import { Layout } from 'antd';

export default function Footer() {
    return (
        <Layout.Footer>
            <div className="container">
                <footer className="py-5">
                    <div className="row">
                        <div className="col-6 col-md-2 mb-3">
                            <h5>Trang</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Features
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Pricing
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        FAQs
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        About
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-2 mb-3">
                            <h5>Danh mục</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Features
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Pricing
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        FAQs
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        About
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-2 mb-3">
                            <h5>Hỗ Trợ</h5>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Home
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Features
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        Pricing
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        FAQs
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a href="#" className="nav-link p-0 text-muted">
                                        About
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-5 offset-md-1 mb-3">
                            <form>
                                <h5>Nhận những thông tin mới nhất từ chúng tôi</h5>
                                <p>Monthly digest of what's new and exciting from us.</p>
                                <div className="d-flex flex-column w-100 gap-2">
                                    <label for="name" className="visually-hidden">
                                        Tên
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="form-control border rounded p-2"
                                        placeholder="Tên"
                                    />
                                    <label for="email" className="visually-hidden">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="text"
                                        className="form-control border rounded p-2"
                                        placeholder="Email"
                                    />
                                    <label for="title" className="visually-hidden">
                                        Tiêu đề
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-control border rounded p-2"
                                        placeholder="Tiêu đề"
                                    />
                                    <label for="content" className="visually-hidden">
                                        Nội dung
                                    </label>
                                    <textarea
                                        id="content"
                                        className="form-control border rounded p-2"
                                        placeholder="Nội dung"
                                    />
                                    <button className="btn btn-primary btn-lg" type="submit">
                                        Gửi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
                        <p>© 2024 Aliconcon, Inc. All rights reserved.</p>
                        <ul className="list-unstyled d-flex">
                            <li className="ms-3">
                                <a className="link-dark" href="#">
                                    <svg className="bi" width="24" height="24">
                                        <use xlink:href="#twitter"></use>
                                    </svg>
                                </a>
                            </li>
                            <li className="ms-3">
                                <a className="link-dark" href="#">
                                    <svg className="bi" width="24" height="24">
                                        <use xlink:href="#instagram"></use>
                                    </svg>
                                </a>
                            </li>
                            <li className="ms-3">
                                <a className="link-dark" href="#">
                                    <svg className="bi" width="24" height="24">
                                        <use xlink:href="#facebook"></use>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </footer>
            </div>
        </Layout.Footer>
    );
}
