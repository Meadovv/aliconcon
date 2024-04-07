'use strict'

const express = require('express');
const ProductController = require('../controllers/product.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/create', ErrorMiddleware.asyncHandler(ProductController.createProduct));

module.exports = router;