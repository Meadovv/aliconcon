// const image_host = 'https://image.aliconcon.xyz/'
const image_host = 'http://localhost:9000/'

export const IMAGE_HOST = {
    THUMBNAIL: (name) => {
        return image_host + 'thumbnail?file=' + name + '&width=300&height=300&type=webp';
    },
    ORIGINAL: (name) => {
        return image_host + 'crop?file=' + name + '&width=1000&height=1000&type=webp';
    }
}

// export const BACKEND_API = 'https://api.aliconcon.xyz/v1/';
export const BACKEND_API = 'http://localhost:3055/v1/';

export const PAYMENT_GATE = 'http://20.2.158.32/pay/';

const api = {
    GET_PRODUCTS: ({ shop, category, low_price, high_price }) => {
        return BACKEND_API + 'shop/get-products?shop=' + shop + '&category=' + category + '&low_price=' + low_price + '&high_price=' + high_price;
    },
    GET_PRODUCT: ({ id, user }) => {
        return BACKEND_API + 'shop/get-product?id=' + id + '&user=' + user;
    },
    GET_CATEGORY: ({ shop }) => {
        return BACKEND_API + 'shop/get-categories?shopId=' + shop;
    },
    GET_SHOP: ({ shop }) => {
        return BACKEND_API + 'shop/get-shop?shopId=' + shop;
    },
    GET_TRACKING: ({ id }) => {
        return BACKEND_API + 'user/get-order?orderId=' + id;
    },
    GET_USER_TRACKING: BACKEND_API + 'user/get-order',
    PAYMENT_GATE: ({ id }) => {
        return PAYMENT_GATE + id;
    },
    REGISTER: BACKEND_API + 'user/register',
    CHECKOUT: BACKEND_API + 'user/checkout',
    CHANGE_PASSWORD: BACKEND_API + 'access/change-password',
    GET_INFORMATION: BACKEND_API + 'user/information',
    REMOVE_FROM_CART: BACKEND_API + 'user/remove-from-cart',
    CLEAR_CART: BACKEND_API + 'user/clear-cart',
    TOGGLE_CART: BACKEND_API + 'user/toggle-cart',
    GET_CART: BACKEND_API + 'user/get-cart',
    ADD_TO_CART: BACKEND_API + 'user/add-to-cart',
    GET_VARIANT: BACKEND_API + 'shop/get-variation',
    LOGIN: BACKEND_API + 'user/login',
    METADATA: BACKEND_API + 'user/metadata',
    LOGOUT: BACKEND_API + 'access/logout',
    SWITCH_PRODUCT_LIKE: BACKEND_API + 'user/switch-product-like',
    LEAVE_COMMENT: BACKEND_API + 'user/leave-comment',
    FORGOT_PASSWORD: BACKEND_API + 'access/forgot-password',
    CHECK_TOKEN: BACKEND_API + 'access/check-token',
    PASSWORD_RESET: BACKEND_API + 'access/password-reset',
    ADD_ADDRESS: BACKEND_API + 'user/add-address',
    REMOVE_ADDRESS: BACKEND_API + 'user/remove-address',
    SET_DEFAULT_ADDRESS: BACKEND_API + 'user/set-default-address',
    GET_ORDERS: BACKEND_API + 'user/get-orders',
    GET_WISHLIST: BACKEND_API + 'user/get-wishlist',
}

export default api;