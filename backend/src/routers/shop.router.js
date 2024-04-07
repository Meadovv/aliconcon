'use strict'

const express = require('express');
const AccessController = require('../controllers/access.controller');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.post('/auth/signup', ErrorMiddleware.asyncHandler(AccessController.signUp));
router.post('/auth/login', ErrorMiddleware.asyncHandler(AccessController.login));

// Authentication
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/auth/logout', ErrorMiddleware.asyncHandler(AccessController.logout));
router.post('/auth/get', ErrorMiddleware.asyncHandler(AccessController.get));


module.exports = router;