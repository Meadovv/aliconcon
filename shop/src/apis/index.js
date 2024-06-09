const host = 'http://localhost:3055/v1/'
const image_host = 'http://localhost:9000/'
const api = {
    LOGIN: host + 'shop/login',
    REGISTER: host + 'shop/register',
    CHECK_MAIL: host + 'access/check-mail',
    METADATA: host + 'shop/metadata',
    LOGOUT: host + 'access/logout',
    GET_USER_LIST: host + 'shop/get-user-list',
    GET_USER: host + 'shop/get-user',
    ADD_USER: host + 'shop/add-user',
    DELETE_USER: host + 'shop/delete-user',
    SWITCH_USER_STATUS: host + 'shop/switch-user-status',
    CHANGE_USER_ROLE: host + 'shop/change-user-role',
    CREATE_CATEGORY: host + 'shop/create-category',
    DELETE_CATEGORY: host + 'shop/delete-category',
    GET_CATEGORY: host + 'shop/get-category',
    GET_CATEGORIES: host + 'shop/get-categories',
    UPDATE_CATEGORY: host + 'shop/update-category',
    UPLOAD_IMAGE: host + 'image/upload',
    GET_IMAGE: host + 'image/get',
    DELETE_IMAGE: host + 'image/delete',
    ADD_PRODUCT: host + 'shop/create-product',
    GET_PRODUCTS: host + 'shop/get-products',
    ADD_GROUP: host + 'shop/create-group',
    GET_GROUPS: host + 'shop/get-groups',
    GET_PRODUCT: host + 'shop/get-product',
    DELETE_PRODUCT: host + 'shop/delete-product',
    GET_VOUCHERS: host + 'shop/get-vouchers',
    CREATE_VOUCHER: host + 'shop/create-voucher',
    GET_VOUCHER: host + 'shop/get-voucher',
    DELETE_VOUCHER: host + 'shop/delete-voucher',
    UPDATE_VOUCHER: host + 'shop/update-voucher',
    DELETE_PRODUCT: host + 'shop/delete-product',
    UPDATE_PRODUCT: host + 'shop/update-product',
    GET_ORDERS: host + 'shop/get-orders',
    GET_ORDER: host + 'shop/get-order',
}

export const IMAGE_HOST = {
    THUMBNAIL: (name) => {
        return image_host + 'thumbnail?file=' + name + '&width=200&height=200&type=webp';
    },
    ORIGINAL: (name) => {
        return image_host + 'crop?file=' + name + '&width=1000&height=1000&type=webp';
    }
}

export default api;