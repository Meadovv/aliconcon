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
            const product = action.payload.product;
            const variant = action.payload.variant;
            const quantity = action.payload.quantity;

            const idx = state.carts.findIndex((item) => item.product._id === product._id && item.variant._id === variant._id);
            if(idx !== -1) {
                state.carts[idx].quantity += quantity;
            } else {
                state.carts.push({
                    product,
                    variant,
                    quantity: quantity
                });
            }
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