'use strict'

const express = require('express');
const AccessController = require('../controllers/access.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.post('/user/register', ErrorMiddleware.asyncHandler(AccessController.userRegister));
router.post('/user/login', ErrorMiddleware.asyncHandler(AccessController.userLogin));

router.post('/shop/register', ErrorMiddleware.asyncHandler(AccessController.shopRegister));
router.post('/shop/login', ErrorMiddleware.asyncHandler(AccessController.shopLogin));

router.post('/admin/login', ErrorMiddleware.asyncHandler(AccessController.adminLogin));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

// Authorization
router.post('/user/metadata', ErrorMiddleware.asyncHandler(AccessController.getUser));
router.post('/shop/metadata', ErrorMiddleware.asyncHandler(AccessController.getShop));
router.post('/admin/metadata', ErrorMiddleware.asyncHandler(AccessController.getAdmin));

router.post('/logout', ErrorMiddleware.asyncHandler(AccessController.logout));

module.exports = router;