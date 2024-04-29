import { Link } from 'react-router-dom';

function Public({ children }) { // Người dùng chưa đăng nhập mới có thể truy cập

    if(localStorage.getItem('x-client-id') && localStorage.getItem('x-token-id')) {
        return <Link to='/' />
    }
    return children;
}

export default Public;