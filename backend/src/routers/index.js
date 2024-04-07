'use strict'

const express = require('express');
const router = express.Router();

// routes
router.use('/api/v1/access', require('./access.router'));
router.use('/api/v1/product', require('./product.router'));
router.use('/api/v1/category', require('./category.router'))

module.exports = router;