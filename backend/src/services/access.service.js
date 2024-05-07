'use strict'

const UserService = require('./user.service');
const KeyTokenService = require("./keyToken.service");
const Utils = require("../utils");
const userModel = require('../models/user.model');

const {
    BAD_REQUEST_ERROR
} = require('../core/error.response');

class AccessService {
    static getMetadata = async (userId) => {
        const foundUser = await UserService.findById(userId);
        if (!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }

        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'email', 'role', 'phone', 'address'],
            object: foundUser
        });
    }

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
        userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'email', 'role', 'phone', 'address'],
            object: foundUser
        });
    }

    static logout = async ({ userId }) => {
        return await KeyTokenService.deleteByUserId(userId);
    }
}

module.exports = AccessService;