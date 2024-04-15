'use strict'

const UserService = require('./user.service');
const ShopService = require('./shop.service');
const KeyTokenService = require("./keyToken.service");
const Utils = require("../utils");
const ROLES = require("../constants/ROLES")

const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
} = require('../core/error.response');

class AccessService {

    static userRegister = async ({ name, email, password, address, phone }) => {
        // Check if the email is already registered

        const foundUser = await UserService.findByEmail(email);
        if (foundUser) {
            throw new BAD_REQUEST_ERROR('User already registered!');
        }

        const passwordHash = await Utils.AuthUtils.createHashPassword(password);
        const newUser = await UserService.createUser({
            name, email, password: passwordHash, address, phone
        })

        if (newUser) {
            const key = Utils.AuthUtils.createKey(64);
            await KeyTokenService.createKeyToken({
                userId: newUser._id,
                key: key
            });
            
            const token = await Utils.AuthUtils.createToken({
                payload: { userId: newUser._id },
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

        return null;
    }

    static userLogin = async ({ email, password }) => {
        const foundUser = await UserService.findByEmail(email);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not registered!');
        }

        if(!foundUser.active) {
            throw new BAD_REQUEST_ERROR('Account is banned!');
        }

        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if(!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }

        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        const token = await Utils.AuthUtils.createToken({
            payload: { userId: foundUser._id },
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

    static getUser = async (userId) => {
        const foundUser = await UserService.findById(userId);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }

        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'email', 'phone', 'address'],
            object: foundUser
        });
    }

    static shopLogin = async ({ shop_email, user_email, password  }) => {
        const foundShop = await ShopService.findByEmail(shop_email);
        if(!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not registered!');
        }
        const foundUser = foundShop.users.find(user => user.email === user_email);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if(!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }

        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        const token = await Utils.AuthUtils.createToken({
            payload: { shopId: foundShop._id, userId: foundUser._id, role: foundUser.role },
            key: key
        });

        return {
            shop: {
                ...Utils.OtherUtils.getInfoData({
                    fields: ['_id', 'name'],
                    object: foundShop
                }),
                userId: foundUser._id,
                role: foundUser.role
            },
            token: token
        }
    }

    static shopRegister = async ({ name, email, password, phone, address }) => {
        const foundShop = await ShopService.findByEmail(email);
        if(foundShop) {
            throw new BAD_REQUEST_ERROR('Shop already registered!');
        }

        const passwordHash = await Utils.AuthUtils.createHashPassword(password);
        const newShop = await ShopService.createShop({
            name, email, password: passwordHash, phone, address
        });

        if (newShop) {
            const key = Utils.AuthUtils.createKey(64);
            await KeyTokenService.createKeyToken({
                userId: newShop.users[0]._id,
                key: key
            });
            
            const token = await Utils.AuthUtils.createToken({
                payload: { shopId: newShop._id, userId: newShop.users[0]._id, role: newShop.users[0].role },
                key: key
            });

            return {
                shop: {
                    ...Utils.OtherUtils.getInfoData({
                        fields: ['_id', 'name'],
                        object: newShop
                    }),
                    userId: newShop.users[0]._id,
                    role: newShop.users[0].role
                },
                token: token
            }

        }

        return null;

    }

    static getShop = async ( jwt_decode ) => {

    }

    static adminLogin = async () => {

    }

    static getAdmin = async () => {

    }

    static logout = async (userId) => {
        return await KeyTokenService.deleteByUserId(userId);
    }
}

module.exports = AccessService;