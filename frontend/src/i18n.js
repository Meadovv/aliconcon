import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const defaultLanguage = 'vi';
const resources = {
    en: {
        translation: {
            'signin': 'Sign In',
            'signup': 'Sign Up',
            'dont-have-account': 'Don\'t have account?',
            'already-have-account': 'Already have account?',
            'forgot-password': 'Forgot password?',
            'email': 'Email',
            'name': 'Name',
            'address': 'Address',
            'password': 'Password',
            'phone': 'Phone',
            'logout': 'Logout',
            'signin-welcome': 'Please login to your account!',
            'signup-welcome': 'Please register for a new account!',
            'vietnamese': 'Vietnamese',
            'english': 'English',
            'search now': 'What are you looking for today?',
            'for-seller-page': 'For Seller',
            'for-admin-page': 'For Admin',
            'home-page': 'Home',
            'profile': 'Profile',
            'cart': 'Cart',
            'orders': 'Order',
            'support': 'Support',
            'help-center': 'Help Center',
            'terms-of-service': 'Terms of Service',
            'privacy-policy': 'Privacy Policy',
            'shipping-policy': 'Shipping Policy',
            'about-us': 'About Us',
            'payment-method': 'Payment Method',
            'aliconcon-pay': 'Aliconcon Pay',
            'stay-up-to-date': 'Stay up to date with our latest news and products',
            'your-email-address': 'Your email address',
            'all-rights-reserved': '© 2024 Aliconcon. All rights reserved'
        },
    },
    vi: {
        translation: {
            'signin': 'Đăng nhập',
            'signup': 'Đăng ký',
            'dont-have-account': 'Chưa có tài khoản?',
            'already-have-account': 'Đã có tài khoản?',
            'forgot-password': 'Quên mật khẩu?',
            'email': 'Thư điện tử',
            'name': 'Tên',
            'address': 'Địa chỉ',
            'password': 'Mật khẩu',
            'phone': 'Điện thoại',
            'logout': 'Đăng xuất',
            'signin-welcome': 'Đăng nhập vào tài khoản của bạn!',
            'signup-welcome': 'Vui lòng đăng ký tài khoản mới!',
            'vietnamese': 'Tiếng Việt',
            'english': 'Tiếng Anh',
            'search now': 'Bạn tìm gì hôm nay?',
            'for-seller-page': 'Người bán',
            'for-admin-page': 'Quản trị viên',
            'home-page': 'Trang chủ',
            'profile': 'Hồ sơ',
            'cart': 'Giỏ hàng',
            'orders': 'Đơn hàng',
            'support': 'Hỗ trợ',
            'help-center': 'Trung tâm trợ giúp',
            'terms-of-service': 'Điều khoản dịch vụ',
            'privacy-policy': 'Chính sách bảo mật',
            'shipping-policy': 'Chính sách giao hàng',
            'about-us': 'Về chúng tôi',
            'payment-method': 'Phương thức thanh toán',
            'aliconcon-pay': 'Ví Aliconcon',
            'stay-up-to-date': 'Cập nhật tin tức và sản phẩm mới nhất của chúng tôi',
            'your-email-address': 'Địa chỉ email của bạn',
            'all-rights-reserved': '© 2024 Aliconcon. Tất cả mọi quyền được bảo lưu'
        },
    },
}

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng: defaultLanguage,
        fallbackLng: defaultLanguage,
        debug: true,
        resources
    });

export default i18n;