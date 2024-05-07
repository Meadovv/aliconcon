import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './actions/loader.slice';
import userSlice from './actions/user.slice';

const store = configureStore({
    reducer: {
        // Add reducers here
        loader: loaderSlice,
        user: userSlice,
    }
})

export default store;