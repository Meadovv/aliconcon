const shopModel = require('../models/shop.model');
const ROLES = require('../constants/ROLES');
const {
    BAD_REQUEST_ERROR
} = require('../core/error.response');
const Utils = require('../utils');

class ShopService {
    static findByEmail = async (email) => {
        return await shopModel.findOne({ email }).lean();
    }

    static findById = async (id) => {
        return await shopModel.findById({ _id: id }).lean();
    }

    static createShop = async ({ name, email, password, phone, address }) => {
        return await shopModel.create({
            name,
            email,
            phone,
            address,
            users: [
                {
                    email: email,
                    password: password,
                    role: ROLES.OWNER,
                    active: true,
                    addBy: null
                }
            ]
        });
    }

    static addUser = async ({ shopId, userId, target_email, target_password, target_role }) => {
        const foundShop = await shopModel.findById({ _id: shopId }).lean();
        if (!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!');
        }
        const user = foundShop.users.find(user => user._id == userId);
        if(!user) {
            throw new BAD_REQUEST_ERROR('You are not in shop account list!');
        }
        if(user.role >= target_role) {
            throw new BAD_REQUEST_ERROR('You are not authorized to add user!');
        }
        const foundUser = foundShop.users.find(user => user.email === target_email);
        if (foundUser) {
            throw new BAD_REQUEST_ERROR('User already exists!');
        }
        const passwordHash = await Utils.AuthUtils.createHashPassword(target_password);
        const newUser = {
            email: target_email,
            password: passwordHash,
            role: target_role,
            active: true,
            addBy: user._id
        }
        foundShop.users.push(newUser);

        await shopModel.updateOne({ _id: shopId }, { users: foundShop.users });

        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'email', 'role'],
            object: newUser
        });
    }

    static deleteUser = async ({ shopId, userId, target_email }) => {
        const foundShop = await shopModel.findById({ _id: shopId }).lean();
        if (!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!');
        }
        const user = foundShop.users.find(user => user._id == userId);
        if(!user) {
            throw new BAD_REQUEST_ERROR('You are not in shop account list!');
        }
        const targetUser = foundShop.users.find(user => user.email === target_email);
        if (!targetUser) {
            throw new BAD_REQUEST_ERROR('User not found!');
        }
        if(user.role >= targetUser.role) {
            throw new BAD_REQUEST_ERROR('You are not authorized to delete user!');
        }
        foundShop.users = foundShop.users.filter(user => user.email !== target_email);

        await shopModel.updateOne({ _id: shopId }, { users: foundShop.users });

        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'email', 'role'],
            object: targetUser
        });
    }

    static getUserList = async ({ shopId, userId }) => {
        const foundShop = await shopModel.findById({ _id: shopId }).lean();
        if (!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!');
        }
        const foundUser = foundShop.users.find(user => user._id == userId);
        console.log(foundUser);
        if(!foundUser) {
            throw new BAD_REQUEST_ERROR('You are not in shop account list!');
        }
        const userList = []
        foundShop.users.forEach(user => {
            if(user.role > foundUser.role) userList.push(Utils.OtherUtils.getInfoData({
                fields: ['_id', 'email', 'role'],
                object: user
            }));
        })
        return userList;
    }

    static changePassword = async ({ shopId, userId, old_password, new_password }) => {
        const foundShop = await shopModel.findById({ _id: shopId }).lean();
        if (!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!');
        }
        const user = foundShop.users.find(user => user._id == userId);
        if(!user) {
            throw new BAD_REQUEST_ERROR('You are not in shop account list!');
        }
        if (!await Utils.AuthUtils.comparePassword(old_password, user.password)) {
            throw new BAD_REQUEST_ERROR('Old password is incorrect!');
        }
        const passwordHash = await Utils.AuthUtils.createHashPassword(new_password);
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'email', 'role'],
            object: user
        })
    }
}

module.exports = ShopService;