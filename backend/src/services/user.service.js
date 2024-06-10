'use strict'

const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const commentModel = require('../models/comment.model');
const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
    NOT_FOUND_ERROR
} = require('../core/error.response');
const KeyTokenService = require('./keyToken.service');
const Utils = require('../utils');
const ROLES = require('../constants/ROLES');
class UserService {

    static removeAddress = async ({ userId, index }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }

        if(index < 0 || index >= foundUser.address.length) {
            throw new BAD_REQUEST_ERROR('Invalid index!');
        }

        if(index === foundUser.default_address) {
            throw new BAD_REQUEST_ERROR('Cannot remove default address!');
        }
        
        foundUser.address.splice(index, 1);
        
        if (index < foundUser.default_address) {
            foundUser.default_address--;
        }
        
        await userModel.findByIdAndUpdate(userId, foundUser);
        return {
            address: foundUser.address,
            default_address: foundUser.default_address
        }
    }

    static setDefaultAddress = async ({ userId, index }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        foundUser.default_address = index;
        await userModel.findByIdAndUpdate(userId, foundUser);
        return {
            address: foundUser.address,
            default_address: foundUser.default_address
        }   
    }

    static addAddress = async ({ userId, address, isDefault }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        foundUser.address.push(address);
        if (isDefault) {
            foundUser.default_address = foundUser.address.length - 1;
        }
        await userModel.findByIdAndUpdate(userId, foundUser);
        return {
            address: foundUser.address,
            default_address: foundUser.default_address
        }
    }

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

        const token = Utils.AuthUtils.createToken({
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
        const token = Utils.AuthUtils.createToken({
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

    static getInformation = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        foundUser.password = undefined;
        return foundUser;
    }

    static leaveComment = async ({ userId, productId, comment }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) {
            throw new NOT_FOUND_ERROR('Product not found!');
        }
        const newComment = await commentModel.create({
            user: userId,
            product: productId,
            comment
        });

        return newComment;
    }

    static checkSellerStatus = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const foundShop = await shopModel.findOne({ 
            users: {
                $elemMatch: {
                    _id: userId, 
                    role: ROLES.SHOP_OWNER
                }
            }
        }).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        return foundShop;
    }
}

module.exports = UserService;