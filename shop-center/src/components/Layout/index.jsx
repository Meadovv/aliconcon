// import { useSelector } from 'react-redux';

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

function Layout({ children }) {
    // const { loader } = useSelector((state) => state.loader);
    return (
        <div className="page-container">
            <Header />
            {children}
            <Footer />
        </div>
    );
}
export default Layout;