'use strict'

const KeyTokenService = require("./keyToken.service");
const Utils = require("../utils");
const userModel = require('../models/user.model');
const MailerService = require('./mail.service');

const { UNAUTHORIZED_ERROR, TOKEN_EXPIRED_ERROR, BAD_REQUEST_ERROR } = require("../core/error.response");

class AccessService {
    static changePassword = async ({ userId, oldPassword, newPassword }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        const passwordMatch = await Utils.AuthUtils.comparePassword(oldPassword, foundUser.password);
        if (!passwordMatch) {
            throw new BAD_REQUEST_ERROR('Old password is incorrect!');
        }
        const hashedPassword = await Utils.AuthUtils.createHashPassword(newPassword);
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'email', 'role', 'phone', 'address'],
            object: foundUser
        });
    }

    static forgotPassword = async ({ email }) => {
        const foundUser = await userModel.findOne({ email }).lean();
        if (!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });

        const token = Utils.AuthUtils.createToken({
            payload: { userId: foundUser._id },
            key: key,
            expiredIn: '300s'
        });
        MailerService.sendVerificationEmail({
            to: foundUser.email,
            name: foundUser.name,
            key: token
        });
        return true;
    }

    static checkToken = async ({ email, token }) => {
        const foundUser = await userModel.findOne({ email: email }).lean();
        if (!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        const foundKeyToken = await KeyTokenService.findByUserId(foundUser._id);
        if (!foundKeyToken) {
            throw new BAD_REQUEST_ERROR('Token not found!');
        }
        const tokenData = Utils.AuthUtils.verifyToken(token, foundKeyToken.key);
        if (!tokenData) {
            throw new BAD_REQUEST_ERROR('Token is invalid!');
        }
        return true;
    }

    static passwordReset = async ({ email, token, password }) => {
        const foundUser = await userModel.findOne({ email: email }).lean();
        if (!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        const foundKeyToken = await KeyTokenService.findByUserId(foundUser._id);
        if (!foundKeyToken) {
            throw new BAD_REQUEST_ERROR('Token not found!');
        }
        try {
            Utils.AuthUtils.verifyToken(token, foundKeyToken.key);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new TOKEN_EXPIRED_ERROR('Token has expired');
            } else if (err.name === 'JsonWebTokenError') {
                throw new UNAUTHORIZED_ERROR('Invalid token');
            } else {
                throw new BAD_REQUEST_ERROR(err.message);
            }
        }
        const hashedPassword = await Utils.AuthUtils.createHashPassword(password);
        await userModel.findByIdAndUpdate(foundUser._id, { password: hashedPassword });
        return true;
    }

    static logout = async ({ userId }) => {
        return await KeyTokenService.deleteByUserId(userId);
    }

    static checkMail = async ({ email }) => {
        const foundUser = await userModel.findOne({ email }).lean();
        if (foundUser) return false;
        return true;
    }
}

module.exports = AccessService;