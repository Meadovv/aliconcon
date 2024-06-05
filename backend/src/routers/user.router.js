'use strict'

const express = require('express');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const UserController = require('../controllers/user.controller');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.post('/register', ErrorMiddleware.asyncHandler(UserController.register));
router.post('/login', ErrorMiddleware.asyncHandler(UserController.login));
router.post('/checkout', ErrorMiddleware.asyncHandler(UserController.checkout));

router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/metadata', ErrorMiddleware.asyncHandler(UserController.metadata));
router.post('/get-comment', ErrorMiddleware.asyncHandler(UserController.getComments));
router.post('/leave-comment', ErrorMiddleware.asyncHandler(UserController.leaveComment));
router.post('/information', ErrorMiddleware.asyncHandler(UserController.getInformation));

router.post('/add-to-cart', ErrorMiddleware.asyncHandler(UserController.addToCart));
router.post('/get-cart', ErrorMiddleware.asyncHandler(UserController.getCart));
router.post('/remove-from-cart', ErrorMiddleware.asyncHandler(UserController.removeFromCart));
router.post('/clear-cart', ErrorMiddleware.asyncHandler(UserController.clearCart));
router.post('/toggle-cart', ErrorMiddleware.asyncHandler(UserController.toggleCart));

module.exports = router;