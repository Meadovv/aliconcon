const shopModel = require('../models/shop.model');
const userModel = require('../models/user.model');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR
} = require('../core/error.response');
const Utils = require('../utils');
const ROLES = require('../constants/ROLES');

const KeyTokenService = require('./keyToken.service');
const categoryModel = require('../models/category.model');

class ShopService {

    static metadata = async ({ shopId, userId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new UNAUTHENTICATED_ERROR('User not in shop!');
        }
        return {
            shop: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            user: {
                ...Utils.OtherUtils.getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: foundUser
                }),
                role: userInShop.role
            }
        }
    }

    static login = async ({ email, shopEmail, password }) => {
        const foundUser = await userModel.findOne({ email }).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not registered!');
        }
        if (!foundUser.active) {
            throw new FORBIDDEN_ERROR('Account is banned!');
        }
        const foundShop = await shopModel.findOne({ email: shopEmail }).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not registered!');
        }

        if (!foundShop.active) {
            throw new FORBIDDEN_ERROR('Shop is banned!');
        }

        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }

        if (!userInShop.active) {
            throw new FORBIDDEN_ERROR('User is banned!');
        }

        const passwordMatch = await Utils.AuthUtils.comparePassword(password, foundUser.password);
        if (!passwordMatch) {
            throw new UNAUTHENTICATED_ERROR('Password incorrect!');
        }
        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: foundUser._id,
            key: key
        });
        const token = await Utils.AuthUtils.createToken({
            payload: { shopId: foundShop._id, userId: foundUser._id, role: userInShop.role },
            key: key
        });

        return {
            shop: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            user: {
                ...Utils.OtherUtils.getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: foundUser
                }),
                role: userInShop.role
            },
            token: token
        }
    }

    static register = async ({ name, email, password, address, phone, shopName, shopEmail, shopAddress }) => {
        const foundUser = await userModel.findOne({ email: email }).lean();
        if (foundUser) {
            throw new BAD_REQUEST_ERROR('User already registered!');
        }
        const foundShop = await shopModel.findOne({ email: shopEmail }).lean();
        if (foundShop) {
            throw new BAD_REQUEST_ERROR('Shop Email already registered!');
        }
        const hashPassword = await Utils.AuthUtils.createHashPassword(password);
        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            address: [address],
            phone
        });
        const newShop = await shopModel.create({
            name: shopName,
            email: shopEmail,
            address: shopAddress,
            phone,
            users: [{ _id: newUser._id, role: ROLES.SHOP_OWNER }]
        });
        const key = Utils.AuthUtils.createKey(64);
        await KeyTokenService.createKeyToken({
            userId: newUser._id,
            key
        });
        const token = await Utils.AuthUtils.createToken({
            payload: { shopId: newShop._id, userId: newUser._id, role: newUser.role },
            key
        });
        return {
            shop: Utils.OtherUtils.getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newShop
            }),
            user: {
                ...Utils.OtherUtils.getInfoData({
                    fields: ['_id', 'name', 'email'],
                    object: newUser
                }),
                role: ROLES.SHOP_OWNER
            },
            token: token
        }
    }

    static addUser = async ({ shopId, userId, targetEmail, targetRole }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        if (targetRole <= userInShop.role) {
            throw new FORBIDDEN_ERROR('You are not authorized to add this role');
        }
        const foundTargetUser = await userModel.findOne({ email: targetEmail }).lean();
        if (!foundTargetUser) {
            throw new NOT_FOUND_ERROR('Target user not found!');
        }
        if (foundShop.users.find(user => user._id.toString() === foundTargetUser._id.toString())) {
            throw new BAD_REQUEST_ERROR('Target user is already in user list!');
        }
        foundShop.users.push({
            _id: foundTargetUser._id,
            role: targetRole,
            addBy: userId
        });
        await shopModel.findByIdAndUpdate({
            _id: foundShop._id
        }, foundShop)
        const shop = await shopModel
            .findById(foundShop._id)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        shop.users = shop.users
            .filter(user => user.role > userInShop.role)
            .map(user => ({
                user: user._id,
                role: user.role,
                addBy: user.addBy,
                createdAt: user.createdAt,
                active: user.active
            }));
        return shop.users;
    }

    static deleteUser = async ({ shopId, userId, targetEmail }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        const foundTargetUser = await userModel.findOne({ email: targetEmail }).lean();
        if (!foundTargetUser) {
            throw new NOT_FOUND_ERROR('Target user not found!');
        }
        const targetUserInShop = foundShop.users.find(user => user._id.toString() === foundTargetUser._id.toString())
        if (!targetUserInShop) {
            throw new BAD_REQUEST_ERROR('Target user is not in user list!');
        }
        if (userInShop.role >= targetUserInShop.role) {
            throw new FORBIDDEN_ERROR('You are not authorized to delete this user!')
        }
        foundShop.users = foundShop.users.filter(user => user._id.toString() !== foundTargetUser._id.toString());
        await shopModel.findByIdAndUpdate({
            _id: foundShop._id
        }, foundShop)
        const shop = await shopModel
            .findById(foundShop._id)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        shop.users = shop.users
            .filter(user => user.role > userInShop.role)
            .map(user => ({
                user: user._id,
                role: user.role,
                addBy: user.addBy,
                createdAt: user.createdAt,
                active: user.active
            }));
        return shop.users;
    }

    static getUserList = async ({ shopId, userId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        const shop = await shopModel
            .findById(foundShop._id)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        shop.users = shop.users
            .filter(user => user.role > userInShop.role)
            .map(user => ({
                user: user._id,
                role: user.role,
                addBy: user.addBy,
                createdAt: user.createdAt,
                active: user.active
            }));
        return shop.users;
    }

    static getUser = async ({ shopId, userId, targetId }) => {
        const foundShop = await shopModel
            .findById(shopId)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        const targetUserInShop = foundShop.users.find(user => user._id._id.toString() === targetId)
        if (!targetUserInShop) {
            throw new BAD_REQUEST_ERROR('Target user is not in user list!');
        }
        if (userInShop.role >= targetUserInShop.role) {
            throw new FORBIDDEN_ERROR('You are not authorized to view this user!')
        }

        return targetUserInShop;
    }

    static switchUserStatus = async ({ shopId, userId, targetId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        const targetUserInShop = foundShop.users.find(user => user._id.toString() === targetId)
        if (!targetUserInShop) {
            throw new BAD_REQUEST_ERROR('Target user is not in user list!');
        }
        if (userInShop.role >= targetUserInShop.role) {
            throw new FORBIDDEN_ERROR('You are not authorized to switch this user status!')
        }
        targetUserInShop.active = !targetUserInShop.active;
        await shopModel.findByIdAndUpdate({
            _id: foundShop._id
        }, foundShop)
        const shop = await shopModel
            .findById(foundShop._id)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        shop.users = shop.users
            .filter(user => user.role > userInShop.role)
            .map(user => ({
                user: user._id,
                role: user.role,
                addBy: user.addBy,
                createdAt: user.createdAt,
                active: user.active
            }));
        return shop.users;
    }

    static changeUserRole = async ({ shopId, userId, targetUser }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!');
        }
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR('User not found!');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === foundUser._id.toString());
        if (!userInShop) {
            throw new NOT_FOUND_ERROR('User not in shop!');
        }
        if (userInShop.role > ROLES.SHOP_ADMIN) {
            throw new FORBIDDEN_ERROR('You are not authorized to do this action!');
        }
        const targetUserInShop = foundShop.users.find(user => user._id.toString() === targetUser._id._id);
        if (!targetUserInShop) {
            throw new BAD_REQUEST_ERROR('Target user is not in user list!');
        }
        if (userInShop.role >= targetUserInShop.role) {
            throw new FORBIDDEN_ERROR('You are not authorized to change this user role!')
        }

        targetUserInShop.role = targetUser.role;
        await shopModel.findByIdAndUpdate({
            _id: foundShop._id
        }, foundShop)

        const shop = await shopModel
            .findById(foundShop._id)
            .populate('users._id', '_id name email')
            .populate('users.addBy', '_id name email')
            .lean();
        shop.users = shop.users
            .filter(user => user.role > userInShop.role)
            .map(user => ({
                user: user._id,
                role: user.role,
                addBy: user.addBy,
                createdAt: user.createdAt,
                active: user.active
            }));
        return shop.users;
    }
}

module.exports = ShopService;