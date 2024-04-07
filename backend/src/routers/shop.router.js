'use strict'

const express = require('express');
const ShopController = require('../controllers/shop.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();


// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

// Authorization
router.post('/add-user', ErrorMiddleware.asyncHandler(ShopController.addUser));

module.exports = router;