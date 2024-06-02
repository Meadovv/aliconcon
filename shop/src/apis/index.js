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

    CREATE_CATEGORY: host + 'shop/create-category',
    DELETE_CATEGORY: host + 'shop/delete-category',
    GET_CATEGORY: host + 'shop/get-category',
    GET_CATEGORIES: host + 'shop/get-categories',
    SWITCH_CATEGORY_STATUS: host + 'shop/switch-category-status',
    UPDATE_CATEGORY: host + 'shop/update-category',

    GET_PRODUCTS: host + 'shop/get-products',
    GET_PRODUCT: host + 'shop/get-product',
    CREATE_PRODUCT: host + 'shop/create-product',
    DELETE_PRODUCT: host + '/shop/delete-product',
    UPDATE_PRODUCT: host + '/shop/update-product',
    SWITCH_PRODUCT_STATUS: host + 'shop/switch-product-status',

    CREATE_GROUP: host + 'shop/create-group',
    DELETE_GROUP: host + 'shop/delete-group',
    UPDATE_GROUP: host + 'shop/update-group',
    GET_GROUP: host + 'shop/get-group',
    GET_GROUPS: host + 'shop/get-groups',
    VIEW_GROUP: host + 'shop/view-group',

    ADD_PRODUCT_TO_GROUP: host + 'shop/add-product-to-group',
    REMOVE_PRODUCT_FROM_GROUP: host + 'shop/remove-product-from-group',

    SWITCH_VOUCHER: host + 'shop/switch-voucher',
    CREATE_VOUCHER: host + 'shop/create-voucher',
    DELETE_VOUCHER: host + 'shop/delete-voucher',
    UPDATE_VOUCHER: host + 'shop/update-voucher',
    GET_VOUCHERS: host + 'shop/get-vouchers',
    GET_VOUCHER: host + 'shop/get-voucher',
}

export default api;