import { configureStore } from "@reduxjs/toolkit";
import {
    userReducer,
    modalReducer,
    cartReducer,
    searchReducer
} from './actions';

const store = configureStore({
    reducer: {
        auth: userReducer,
        modal: modalReducer,
        cart: cartReducer,
        search: searchReducer
    }
});

export default store;