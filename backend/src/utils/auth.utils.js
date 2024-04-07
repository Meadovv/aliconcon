'use strict'

const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
class AuthUtils {
    static createToken = async ({ payload, key }) => {
        const accessToken = JWT.sign(payload, key, { expiresIn: '1 day' });
        return accessToken;
    }

    static createKey = (bytes) => {
        const key = crypto.randomBytes(bytes).toString('hex');
        return key;
    }

    static createHashPassword = async (password) => {
        return await bcrypt.hash(password, 10);
    }

    static comparePassword = async (password, hash) => {
        return await bcrypt.compare(password, hash);
    }

    static verifyToken = async (token, key) => {
        return JWT.verify(token, key);
    }
}

module.exports = AuthUtils;