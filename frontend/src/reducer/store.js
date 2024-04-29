import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './actions/login.slice';
import loaderSlice from './actions/loader.slice';
import userSlice from './actions/user.slice';

const store = configureStore({
    reducer: {
        // Add reducers here
        login: loginSlice,
        loader: loaderSlice,
        user: userSlice,
    }
})

export default store;