'use strict'

const express = require('express');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ProductController = require('../controllers/product.controller');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.get('/get', ErrorMiddleware.asyncHandler(ProductController.getProduct));

router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

module.exports = router;