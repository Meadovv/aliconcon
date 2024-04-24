'use strict'

const express = require('express');
const router = express.Router();

// routes
router.use('/api/v1/access', require('./access.router'));
router.use('/api/v1/shop', require('./shop.router'))
router.use('/api/v1/user', require('./user.router'));

module.exports = router;