'use strict'

const express = require('express');
const ShopController = require('../controllers/shop.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

// Public

router.get('/get-shop', ErrorMiddleware.asyncHandler(ShopController.getShop));
router.post('/register', ErrorMiddleware.asyncHandler(ShopController.register));
router.post('/login', ErrorMiddleware.asyncHandler(ShopController.login));
router.get('/get-categories', ErrorMiddleware.asyncHandler(ShopController.getCategories));
router.get('/get-category', ErrorMiddleware.asyncHandler(ShopController.getCategory));
router.post('/get-variation', ErrorMiddleware.asyncHandler(ShopController.getVariation));
router.get('/get-product', ErrorMiddleware.asyncHandler(ShopController.getProduct));
router.get('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProducts));
router.post('/search-product', ErrorMiddleware.asyncHandler(ShopController.searchProduct));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/metadata', ErrorMiddleware.asyncHandler(ShopController.metadata));
router.post('/add-user', ErrorMiddleware.asyncHandler(ShopController.addUser));
router.post('/delete-user', ErrorMiddleware.asyncHandler(ShopController.deleteUser));
router.post('/get-user-list', ErrorMiddleware.asyncHandler(ShopController.getUserList));
router.post('/change-shop-name', ErrorMiddleware.asyncHandler(ShopController.changeShopName));

router.post('/create-product', ErrorMiddleware.asyncHandler(ShopController.createProduct));
router.post('/delete-product', ErrorMiddleware.asyncHandler(ShopController.deleteProduct));
router.post('/get-product', ErrorMiddleware.asyncHandler(ShopController.getProductByAdmin));
router.post('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProductsByAdmin));
router.post('/update-product', ErrorMiddleware.asyncHandler(ShopController.updateProduct));

router.post('/create-category', ErrorMiddleware.asyncHandler(ShopController.createCategory));
router.post('/delete-category', ErrorMiddleware.asyncHandler(ShopController.deleteCategory));
router.post('/get-category', ErrorMiddleware.asyncHandler(ShopController.getCategoryByAdmin));
router.post('/get-categories', ErrorMiddleware.asyncHandler(ShopController.getCategoriesByAdmin));
router.post('/update-category', ErrorMiddleware.asyncHandler(ShopController.updateCategory));

router.post('/switch-user-status', ErrorMiddleware.asyncHandler(ShopController.switchUserStatus));
router.post('/get-user', ErrorMiddleware.asyncHandler(ShopController.getUser));
router.post('/change-user-role', ErrorMiddleware.asyncHandler(ShopController.changeUserRole));

router.post('/create-voucher', ErrorMiddleware.asyncHandler(ShopController.createVoucher));
router.post('/delete-voucher', ErrorMiddleware.asyncHandler(ShopController.deleteVoucher));
router.post('/get-voucher', ErrorMiddleware.asyncHandler(ShopController.getVoucher));
router.post('/get-vouchers', ErrorMiddleware.asyncHandler(ShopController.getVouchers));
router.post('/update-voucher', ErrorMiddleware.asyncHandler(ShopController.updateVoucher));

router.post('/get-orders', ErrorMiddleware.asyncHandler(ShopController.getOrdersByShop));
router.post('/get-order', ErrorMiddleware.asyncHandler(ShopController.getOrderByShop));

module.exports = router;