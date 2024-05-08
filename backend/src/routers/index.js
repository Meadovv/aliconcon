'use strict'

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send(`Welcome to AliConCon API!`);
})

// routes
router.use('/api/v1/access', require('./access.router'));
router.use('/api/v1/shop', require('./shop.router'))
router.use('/api/v1/user', require('./user.router'));
router.use('/api/v1/image', require('./image.router'));

module.exports = router;