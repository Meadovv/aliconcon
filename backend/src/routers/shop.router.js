'use strict'

const express = require('express');
const ShopController = require('../controllers/shop.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

// Public
router.get('/get-categories', ErrorMiddleware.asyncHandler(ShopController.getCategories));
router.get('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProducts));
router.post('/get-variation', ErrorMiddleware.asyncHandler(ShopController.getVariation));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

// Authorization
router.post('/add-user', ErrorMiddleware.asyncHandler(ShopController.addUser));
router.post('/delete-user', ErrorMiddleware.asyncHandler(ShopController.deleteUser));
router.post('/get-user-list', ErrorMiddleware.asyncHandler(ShopController.getUserList));
router.post('/change-password', ErrorMiddleware.asyncHandler(ShopController.changePassword));

router.post('/create-product', ErrorMiddleware.asyncHandler(ShopController.createProduct));
router.post('/delete-product', ErrorMiddleware.asyncHandler(ShopController.deleteProduct));

router.post('/create-category', ErrorMiddleware.asyncHandler(ShopController.createCategory));
router.post('/delete-category', ErrorMiddleware.asyncHandler(ShopController.deleteCategory));

module.exports = router;