'use strict'

const express = require('express');
const CategoryController = require('../controllers/category.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.post('/get-list-by-shop', ErrorMiddleware.asyncHandler(CategoryController.getCategoryByShop));

router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/create', ErrorMiddleware.asyncHandler(CategoryController.createCategory));

router.post('/delete', ErrorMiddleware.asyncHandler(CategoryController.deleteCategory));

module.exports = router;