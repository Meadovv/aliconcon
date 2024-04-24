'use strict'

const express = require('express');
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const UserController = require('../controllers/user.controller');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));
router.post('/get-comment', ErrorMiddleware.asyncHandler(UserController.getComments));
router.post('/leave-comment', ErrorMiddleware.asyncHandler(UserController.leaveComment));

module.exports = router;