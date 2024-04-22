import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        shop: null,
        token: null
    },
    reducers: {
        setAuth: (state, action) => {
            state.shop = action.payload.shop;
            state.token = action.payload.token;
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
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;