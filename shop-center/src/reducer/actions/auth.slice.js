import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        shop: null,
        token: null
    },
    reducers: {
        setAuth: (state, action) => {
            state.shop = action.payload;
            console.log("aaa");
        },
        removeAuth: (state) => {
            state.shop = null;
            state.token = null;
        },
    }
});

export const { setAuth, removeAuth } = authSlice.actions;

// Selector function to access shop and token
export const selectShop = (state) => state.auth.shop;

export default authSlice.reducer;