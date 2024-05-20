import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        shop: null
    },
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.shop = action.payload.shop;
        },
        removeAuth: (state) => {
            state.user = null;
            state.shop = null;
        }
    }
});

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;