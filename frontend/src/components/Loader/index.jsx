import React from 'react';
import './index.scss';

const Loader = () => {
    return (
        <div className="container">
            <div className="loader flex justify-center align-center">
                <img src="/images/loader.svg" alt="" />
            </div>
        </div>
    );
};

export default Loader;
