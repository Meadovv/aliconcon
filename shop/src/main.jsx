import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

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
