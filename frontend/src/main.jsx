import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'antd/dist/antd.min.js'
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from 'react-redux';
import store from './reducer/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>,
);