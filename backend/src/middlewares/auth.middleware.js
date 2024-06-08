'use strict'

const { UNAUTHORIZED_ERROR, TOKEN_EXPIRED_ERROR, BAD_REQUEST_ERROR } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const Utils = require("../utils");
const mongoose = require('mongoose');

const HEADER = {
    CLIENT_ID: 'x-client-id',
    ACCESS_TOKEN: 'x-token-id',
}

class AuthenticationMiddleware {
    static authentication = async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID]?.toString();
        if (!userId) throw new UNAUTHORIZED_ERROR('Unauthorized Error!');

        const accessToken = req.headers[HEADER.ACCESS_TOKEN]?.toString();
        if (!accessToken) throw new UNAUTHORIZED_ERROR('Header Authorization not found!');

        const keyStore = await KeyTokenService.findByUserId(userId);
        if (!keyStore) throw new UNAUTHORIZED_ERROR('Unauthorized Error!');

        try {
            const decodedUser = await Utils.AuthUtils.verifyToken(accessToken, keyStore.key);
            req.jwt_decode = decodedUser;
            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new TOKEN_EXPIRED_ERROR('Token has expired');
            } else if (error.name === 'JsonWebTokenError') {
                throw new UNAUTHORIZED_ERROR('Invalid token');
            } else {
                throw new BAD_REQUEST_ERROR(error.message);
            }
        }
    }

    static checkCookies = async (req, res, next) => {
        if(!req.cookies['_id']) {
            const _id = new mongoose.Types.ObjectId();
            res.cookie('_id', _id.toString(), { maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
        }
        next();
    }
}

module.exports = AuthenticationMiddleware;