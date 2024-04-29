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
            const productId = action.payload._id;
            const product = state.carts.find(item => item._id === productId);
            if(product) {
                product.quantity += 1;
            } else {
                state.carts.push({
                    ...action.payload,
                    quantity: 1
                });
            }
            state.itemCount += 1;
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