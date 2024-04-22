import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './actions/loader.slice';
import shopReducer from './actions/shop.slice';

const store = configureStore({
    reducer: {
        // Add reducers here
        loader: loaderReducer,
        user: shopReducer,
    }
})

export default store;