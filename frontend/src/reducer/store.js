import { configureStore } from "@reduxjs/toolkit";
import {
    userReducer,
    modalReducer,
    categoryReducer,
    productReducer,
    cartReducer,
    searchReducer
} from './actions';

const store = configureStore({
    reducer: {
        user: userReducer,
        modal: modalReducer,
        category: categoryReducer,
        product: productReducer,
        cart: cartReducer,
        search: searchReducer
    }
});

export default store;