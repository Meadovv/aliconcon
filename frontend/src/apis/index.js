const image_host = 'http://localhost:9000/'

export const IMAGE_HOST = {
    THUMBNAIL: (name) => {
        return image_host + 'thumbnail?file=' + name + '&width=150&height=150&type=webp';
    },
    ORIGINAL: (name) => {
        return image_host + 'crop?file=' + name + '&width=1920&height=1080&type=webp';
    }
}

export const BACKEND_API = 'http://localhost:3055/api/v1/';

const api = {
    GET_PRODUCTS: ({ shop, category, low_price, high_price }) => {
        return BACKEND_API + 'shop/get-products?shop=' + shop + '&category=' + category + '&low_price=' + low_price + '&high_price=' + high_price;
    },
    GET_PRODUCT: ({ id, user }) => {
        return BACKEND_API + 'shop/get-product?id=' + id + '&user=' + user;
    },
    GET_VARIANT: BACKEND_API + 'shop/get-variation',
    LOGIN: BACKEND_API + 'user/login',
    METADATA: BACKEND_API + 'user/metadata',
    LOGOUT: BACKEND_API + 'access/logout',
}

export default api;