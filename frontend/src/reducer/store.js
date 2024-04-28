import { configureStore } from "@reduxjs/toolkit";
import {
    userReducer,
    modalReducer,
    categoryReducer,
    cartReducer,
    searchReducer
} from './actions';

const store = configureStore({
    reducer: {
        auth: userReducer,
        modal: modalReducer,
        category: categoryReducer,
        cart: cartReducer,
        search: searchReducer
    }
});

export default store;