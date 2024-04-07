'use strict'

const userModel = require('../models/user.model');

class UserService {
    static findByEmail = async (email) => {
        return await userModel.findOne({ email }).lean();
    }

    static findById = async (id) => {
        return await userModel.findOne({ _id: id }).lean();
    }

    static createUser = async ({ name, email, password, roles }) => {
        return await userModel.create({
            name, email, password, roles
        });
    }
}

module.exports = UserService;