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

    static userRegister = async ({ name, email, password }) => {
        // Check if the email is already registered

        const user = await UserService.findByEmail(email);
        if (user) {
            throw new BAD_REQUEST_ERROR('Shop already registered!');
        }

        const passwordHash = await Utils.AuthUtils.createHashPassword(password);
        const newUser = await UserService.createUser({
            name, email, password: passwordHash
        })

        if (newUser) {
            const key = Utils.AuthUtils.createKey(64);
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                key: key
            });

            if (!keyStore) {
                throw new BAD_REQUEST_ERROR('Error while storing keys!');
            }

            const token = await Utils.AuthUtils.createToken({
                payload: { userId: newUser._id, email: newUser.email },
                key: key
            });

            return {
                shop: Utils.OtherUtils.getInfoData({
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

        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if(!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }

        const key = Utils.AuthUtils.createKey(64);
        const keyStore = await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        if (!keyStore) {
            throw new BAD_REQUEST_ERROR('Error while storing keys!');
        }
        const token = await Utils.AuthUtils.createToken({
            payload: { userId: foundUser._id, email: foundUser.email },
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
        const user = await UserService.findById(userId);
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'email'],
            object: user
        })
    }

    static shopLogin = async ({ shopEmail, userEmail, password  }) => {
        // Check if the email is already registered
        const foundShop = await ShopService.findByEmail(shopEmail);
        if(!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not registered!');
        }
        
        // Check if user is in shop account list
        const userInList = foundShop.users.find(user => user.email === userEmail);
        if(!userInList) {
            throw new BAD_REQUEST_ERROR('User not in shop account list!');
        }

        const foundUser = await UserService.findByEmail(userEmail);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not registered or deleted!');
        }

        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if(!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }

        const key = Utils.AuthUtils.createKey(64);
        const keyStore = await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        if (!keyStore) {
            throw new BAD_REQUEST_ERROR('Error while storing keys!');
        }
        const token = await Utils.AuthUtils.createToken({
            payload: { shopId: foundShop._id, userId: foundUser._id },
            key: key
        });

        return {
            user: {
                _id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                role: userInList.role
            },
            token: token
        }
    }

    static shopRegister = async ({ shopName, shopEmail, userEmail, password, phone = null, address = null }) => {
        // Check if the email is already registered
        const foundShop = await ShopService.findByEmail(shopEmail);
        if(foundShop) {
            throw new BAD_REQUEST_ERROR('Shop already registered!');
        }

        // Check if user is exist
        const foundUser = await UserService.findByEmail(userEmail);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not registered!');
        }

        // Create new Shop
        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if(!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Authentication failed!');
        }
        const newShop = await ShopService.createShop({
            name: shopName,
            email: shopEmail,
            user: {
                _id: foundUser._id,
                email: foundUser.email,
                role: ROLES.OWNER
            },
            phone,
            address
        });

        if(newShop) {
            const key = Utils.AuthUtils.createKey(64);
            const keyStore = await KeyTokenService.createKeyToken({
                userId: foundUser._id,
                key: key
            });

            if (!keyStore) {
                throw new BAD_REQUEST_ERROR('Error while storing keys!');
            }

            const token = await Utils.AuthUtils.createToken({
                payload: { shopId: newShop._id, userId: foundUser._id },
                key: key
            });

            return {
                shop: Utils.OtherUtils.getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: newShop
                }),
                token: token
            }
        }

        return null;
    }

    static getShop = async ( jwt_decode ) => {
        const foundShop = await ShopService.findById(jwt_decode.shopId);
        if(!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!');
        }

        const foundUser = await UserService.findById(jwt_decode.userId);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        console.log(foundShop)
        const userInList = foundShop.users.filter(user => user._id.toString() === foundUser._id.toString())[0]
        if(!userInList) {
            throw new BAD_REQUEST_ERROR('User not in shop account list!');
        }

        return {
            shopName: foundShop.name,
            shopId: foundShop._id,
            userName: foundUser.name,
            userId: foundUser._id,
            role: userInList.role
        }
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