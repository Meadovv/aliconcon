const host = 'http://localhost:3055/api/v1/'
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
    CREATE_PRODUCT: host + 'shop/create-product',
    CREATE_CATEGORY: host + 'shop/create-category',
    DELETE_CATEGORY: host + 'shop/delete-category',
    GET_CATEGORY: host + 'shop/get-category',
    GET_CATEGORIES: host + 'shop/get-categories',
    SWITCH_CATEGORY_STATUS: host + 'shop/switch-category-status',
    SWITCH_PRODUCT_STATUS: host + 'shop/switch-product-status',
    UPDATE_CATEGORY: host + 'shop/update-category',
    GET_PRODUCTS: host + 'shop/get-products',
    GET_PRODUCT: host + 'shop/get-product',
    DELETE_PRODUCT: host + '/shop/delete-product'
}

export default api;