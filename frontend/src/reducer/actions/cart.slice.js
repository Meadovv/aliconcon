import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    carts: [],
    itemCount: 0,
    total: 0,
}

const calculate = (state) => {
    let itemCount = 0;
    let total = 0;
    state.carts.forEach((cart) => {
        itemCount += cart.quantity;
        total += cart.quantity * cart.variant.price;
    });
    state.itemCount = itemCount;
    state.total = total;
    localStorage.setItem('carts', JSON.stringify(state.carts));
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
            if (idx !== -1) {
                state.carts[idx].quantity += quantity;
            } else {
                state.carts.push({
                    product,
                    variant,
                    quantity: quantity
                });
            }
            calculate(state);
        },

        increaseQuantity: (state, action) => {
            const itemIdx = action.payload.itemIdx;
            state.carts[itemIdx].quantity += 1;
            calculate(state);
        },

        decreaseQuantity: (state, action) => {
            const itemIdx = action.payload.itemIdx;
            state.carts[itemIdx].quantity -= 1;
            if(state.carts[itemIdx].quantity <= 0) {
                state.carts.splice(itemIdx, 1);
            }
            calculate(state);
        },

        restoreCart: (state, action) => {
            state.carts = action.payload.carts;
            calculate(state);
        },

        removeFromCart: (state, action) => {
            calculate(state);
        },

        clearCart: (state) => {
            calculate(state);
        }
    }
});

export const { addToCart, clearCart, removeFromCart, restoreCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;

export default cartSlice.reducer;