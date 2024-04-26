import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: [],
    itemCount: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {

        },

        removeFromCart: (state, action) => {

        },

        clearCart: (state) => {

        },

        getCartTotal: (state) => {

        }
    }
});

export const { addToCart, getCartTotal, clearCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;