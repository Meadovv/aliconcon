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
                    role: ROLES.OWNER
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
            role: target_role
        }
        foundShop.users.push(newUser);

        await shopModel.updateOne({ _id: shopId }, { users: foundShop.users });

        return newUser;
    }
}

module.exports = ShopService;