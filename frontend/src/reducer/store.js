import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './actions/loader.slice';
import userSlice from './actions/user.slice';
import cartSlice from './actions/cart.slice';

const store = configureStore({
    reducer: {
        // Add reducers here
        loader: loaderSlice,
        user: userSlice,
        cart: cartSlice,
    }
})

export default store;