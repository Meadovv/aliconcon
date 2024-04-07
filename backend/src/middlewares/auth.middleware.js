'use strict'

const { UNAUTHORIZED_ERROR, NOT_FOUND_ERROR, TOKEN_EXPIRED_ERROR } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const UserService = require('../services/user.service')
const Utils = require("../utils");

const HEADER = {
    CLIENT_ID: 'x-client-id',
    ACCESS_TOKEN: 'x-token-id',
}

class AuthenticationMiddleware {
    static authentication = async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID]?.toString();
        if(!userId) throw new UNAUTHORIZED_ERROR('Unauthorized Error');

        const user = await UserService.findById(userId);
        if(!user) throw new UNAUTHORIZED_ERROR('User not found');
    
        const keyStore = await KeyTokenService.findByUserId(userId);
        if(!keyStore) throw new NOT_FOUND_ERROR('Key not found');
    
        const accessToken = req.headers[HEADER.ACCESS_TOKEN]?.toString();
        if(!accessToken) throw new UNAUTHORIZED_ERROR('Header Authorization not found');
    
        try {
            const decodedUser = await Utils.AuthUtils.verifyToken(accessToken, keyStore.key);
            if(userId !== decodedUser.userId) throw new UNAUTHORIZED_ERROR('Unauthorized Error');
            req.jwt_decode = decodedUser;
            return next();
        } catch (error) {
            throw new TOKEN_EXPIRED_ERROR('Token Expired');
        }
    }
}

module.exports = AuthenticationMiddleware;