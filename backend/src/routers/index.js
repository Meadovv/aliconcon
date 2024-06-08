'use strict'

const express = require('express');
const router = express.Router();
const AuthenticationMiddleware = require('../middlewares/auth.middleware');

router.get('/', (req, res) => {
    return res.send(`Welcome to AliConCon API!`);
})

// routes

router.use(AuthenticationMiddleware.checkCookies);

router.use('/v1/access', require('./access.router'));
router.use('/v1/shop', require('./shop.router'))
router.use('/v1/user', require('./user.router'));
router.use('/v1/image', require('./image.router'));

module.exports = router;