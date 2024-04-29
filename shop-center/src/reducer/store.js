import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './actions/loader.slice';
import authReducer from './actions/auth.slice';

const store = configureStore({
    reducer: {
        // Add reducers here
        loader: loaderReducer,
        auth: authReducer,
    }
})

export default store;