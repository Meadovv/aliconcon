import {configureStore} from "@reduxjs/toolkit";
import sidebarReducer from "./actions/sidebar.slice";
import categoryReducer from "./actions/category.slide";
import productReducer from "./actions/product.slice";
import cartReducer from "./actions/cart.slice";
import searchReducer from "./actions/search.slice";

const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        category: categoryReducer,
        product: productReducer,
        cart: cartReducer,
        search: searchReducer
    }
});

export default store;