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
router.get('/get-products', ErrorMiddleware.asyncHandler(ShopController.getProducts));
router.post('/get-variation', ErrorMiddleware.asyncHandler(ShopController.getVariation));

router.get('/get-product', ErrorMiddleware.asyncHandler(ShopController.getProduct));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/metadata', ErrorMiddleware.asyncHandler(ShopController.metadata));

router.post('/add-user', ErrorMiddleware.asyncHandler(ShopController.addUser));
router.post('/delete-user', ErrorMiddleware.asyncHandler(ShopController.deleteUser));
router.post('/get-user-list', ErrorMiddleware.asyncHandler(ShopController.getUserList));

router.post('/create-product', ErrorMiddleware.asyncHandler(ShopController.createProduct));
router.post('/delete-product', ErrorMiddleware.asyncHandler(ShopController.deleteProduct));

router.post('/create-category', ErrorMiddleware.asyncHandler(ShopController.createCategory));
router.post('/delete-category', ErrorMiddleware.asyncHandler(ShopController.deleteCategory));

router.post('/upload-image', ErrorMiddleware.asyncHandler(ShopController.uploadImage));
router.post('/delete-image', ErrorMiddleware.asyncHandler(ShopController.deleteImage));

module.exports = router;