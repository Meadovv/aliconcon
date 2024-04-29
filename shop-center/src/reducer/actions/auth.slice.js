import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        shop: null
    },
    reducers: {
        setAuth: (state, action) => {
            console.log(action.payload);
            state.shop = action.payload;
        },
        removeAuth: (state) => {
            state.shop = null;
        },
    }
});

export const { setAuth, removeAuth } = authSlice.actions;

// Selector function to access shop and token
export const selectShop = (state) => state.auth.shop;

export default authSlice.reducer;