'use strict'

const express = require('express');
const ShopController = require('../controllers/shop.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

// Public

router.post('/register', ErrorMiddleware.asyncHandler(ShopController.register));
router.post('/login', ErrorMiddleware.asyncHandler(ShopController.login));
router.get('/get-categories', ErrorMiddleware.asyncHandler(ShopController.getCategories));
router.get('/get-category', ErrorMiddleware.asyncHandler(ShopController.getCategory));
router.post('/get-variation', ErrorMiddleware.asyncHandler(ShopController.getVariation));
router.get('/get-product', ErrorMiddleware.asyncHandler(ShopController.getProduct));
router.get('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProducts));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/metadata', ErrorMiddleware.asyncHandler(ShopController.metadata));
router.post('/add-user', ErrorMiddleware.asyncHandler(ShopController.addUser));
router.post('/delete-user', ErrorMiddleware.asyncHandler(ShopController.deleteUser));
router.post('/get-user-list', ErrorMiddleware.asyncHandler(ShopController.getUserList));

router.post('/create-product', ErrorMiddleware.asyncHandler(ShopController.createProduct));
router.post('/delete-product', ErrorMiddleware.asyncHandler(ShopController.deleteProduct));
router.post('/get-product', ErrorMiddleware.asyncHandler(ShopController.getProductByAdmin));
router.post('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProductsByAdmin));

router.post('/create-category', ErrorMiddleware.asyncHandler(ShopController.createCategory));
router.post('/delete-category', ErrorMiddleware.asyncHandler(ShopController.deleteCategory));
router.post('/get-category', ErrorMiddleware.asyncHandler(ShopController.getCategoryByAdmin));
router.post('/get-categories', ErrorMiddleware.asyncHandler(ShopController.getCategoriesByAdmin));
router.post('/switch-category-status', ErrorMiddleware.asyncHandler(ShopController.switchCategoryStatus));
router.post('/update-category', ErrorMiddleware.asyncHandler(ShopController.updateCategory));

router.post('/switch-user-status', ErrorMiddleware.asyncHandler(ShopController.switchUserStatus));
router.post('/get-user', ErrorMiddleware.asyncHandler(ShopController.getUser));
router.post('/change-user-role', ErrorMiddleware.asyncHandler(ShopController.changeUserRole));

router.post('/create-group', ErrorMiddleware.asyncHandler(ShopController.createGroup));
router.post('/update-group', ErrorMiddleware.asyncHandler(ShopController.updateGroup));
router.post('/delete-group', ErrorMiddleware.asyncHandler(ShopController.deleteGroup));
router.post('/add-product-to-group', ErrorMiddleware.asyncHandler(ShopController.addProductToGroup));
router.post('/remove-product-from-group', ErrorMiddleware.asyncHandler(ShopController.removeProductFromGroup));
router.post('/view-group', ErrorMiddleware.asyncHandler(ShopController.viewGroup));
router.post('/get-groups', ErrorMiddleware.asyncHandler(ShopController.getGroups));

router.post('/create-voucher', ErrorMiddleware.asyncHandler(ShopController.createVoucher));
router.post('/switch-voucher', ErrorMiddleware.asyncHandler(ShopController.switchVoucher));
router.post('/delete-voucher', ErrorMiddleware.asyncHandler(ShopController.deleteVoucher));
router.post('/get-voucher', ErrorMiddleware.asyncHandler(ShopController.getVoucher));
router.post('/get-vouchers', ErrorMiddleware.asyncHandler(ShopController.getVouchers));
router.post('/add-to-voucher', ErrorMiddleware.asyncHandler(ShopController.addToVoucher));

router.post('/add-to-cart', ErrorMiddleware.asyncHandler(ShopController.addToCart));
router.post('/get-cart', ErrorMiddleware.asyncHandler(ShopController.getCart));
router.post('/remove-from-cart', ErrorMiddleware.asyncHandler(ShopController.removeFromCart));
router.post('/clear-cart', ErrorMiddleware.asyncHandler(ShopController.clearCart));

module.exports = router;