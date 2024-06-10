'use strict'

const express = require('express');
const AccessController = require('../controllers/access.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.get('/check-mail', ErrorMiddleware.asyncHandler(AccessController.checkMail));
router.post('/forgot-password', ErrorMiddleware.asyncHandler(AccessController.forgotPassword));
router.post('/check-token', ErrorMiddleware.asyncHandler(AccessController.checkToken));
router.post('/password-reset', ErrorMiddleware.asyncHandler(AccessController.passwordReset));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

// Authorization
router.post('/change-password', ErrorMiddleware.asyncHandler(AccessController.changePassword));
router.post('/logout', ErrorMiddleware.asyncHandler(AccessController.logout));

module.exports = router;