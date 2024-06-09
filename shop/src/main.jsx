import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import "react-datepicker/dist/react-datepicker.css";

import { Provider as ReducerProvider } from 'react-redux';
import store from './reducer/store.js';

import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
        <ReducerProvider store={store}>
            <App />
        </ReducerProvider>,
    </ChakraProvider>
);
