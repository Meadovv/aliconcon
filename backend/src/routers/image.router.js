'use strict'

const express = require('express');
const ShopController = require('../controllers/shop.controller');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.get('/get-image', ErrorMiddleware.asyncHandler(ShopController.getImage));

module.exports = router;