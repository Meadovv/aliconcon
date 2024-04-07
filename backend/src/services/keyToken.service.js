'use strict'
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {

    static createKeyToken = async ({ userId, key }) => {
        return await keyTokenModel.findOneAndUpdate({ user: userId }, { key: key }, { upsert: true, new: true });
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: userId }).lean();
    }

    static deleteByUserId = async (userId) => {
        return await keyTokenModel.deleteMany({ user: userId });
    }

    static findByToken = async (accessToken) => {
        return await keyTokenModel.findOne({ token: accessToken }).lean();
    }
}

module.exports = KeyTokenService;