'use strict'

const userModel = require('../models/user.model');
const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
    NOT_FOUND_ERROR
} = require('../core/error.response');
const KeyTokenService = require('./keyToken.service');
const Utils = require('../utils');
class UserService {

    static metadata = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        return {
            user: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundUser
            })
        }
    }

    static register = async ({ name, email, password, address, phone }) => {
        // Check if the email is already registered

        const foundUser = await userModel.findOne({ email }).lean();
        if (foundUser) {
            throw new BAD_REQUEST_ERROR('User already registered!');
        }

        const passwordHash = await Utils.AuthUtils.createHashPassword(password);
        const newUser = await userModel.create({
            name,
            email,
            password: passwordHash,
            address: [address],
            phone
        })

        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: newUser._id,
            key: key
        });

        const token = await Utils.AuthUtils.createToken({
            payload: { userId: newUser._id, role: newUser.role },
            key: key
        });

        return {
            user: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newUser
            }),
            token: token
        }
    }

    static login = async ({ email, password }) => {
        const foundUser = await userModel.findOne({ email }).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not registered!');
        }

        if (!foundUser.active) {
            throw new UNAUTHENTICATED_ERROR('Account is banned!');
        }

        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if (!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }

        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        const token = await Utils.AuthUtils.createToken({
            payload: { userId: foundUser._id, role: foundUser.role },
            key: key
        });

        return {
            user: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundUser
            }),
            token: token
        }
    }
}

module.exports = UserService;