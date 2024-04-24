'use strict'

const AccessService = require("../services/access.service");

const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')

class AccessController {
    static userLogin = async (req, res) => {
        new SUCCESS({
            message: 'Login successfully!',
            metadata: await AccessService.userLogin({
                ...getFields({
                    fields: ['email', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static userRegister = async (req, res) => {
        new CREATED({
            message: 'User created successfully!',
            metadata: await AccessService.userRegister({
                ...getFields({
                    fields: ['name', 'email', 'password', 'address', 'phone'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static getUser = async (req, res) => {
        new SUCCESS({
            message: 'Get User Information Successfully!',
            metadata: await AccessService.getUser(req.jwt_decode.userId)
        }).send(res);
    }

    static shopLogin = async (req, res) => {
        new SUCCESS({
            message: 'Login successfully',
            metadata: await AccessService.shopLogin({
                ...getFields({
                    fields: ['shop_email', 'user_email', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static shopRegister = async (req, res) => {
        new SUCCESS({
            message: 'Shop created successfully',
            metadata: await AccessService.shopRegister({
                ...getFields({
                    fields: ['name', 'email', 'password', 'phone', 'address'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static getShop = async (req, res) => {
        new SUCCESS({
            message: 'Get Shop Information Successfully',
            metadata: await AccessService.getShop({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static adminLogin = async (req, res, next) => {
        new SUCCESS({
            message: 'Login successfully',
            metadata: await AccessService.adminLogin({
                ...getFields({
                    fields: ['email', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static getAdmin = async (req, res, next) => {
        new SUCCESS({
            message: 'Get Admin Information Successfully',
            metadata: await AccessService.getAdmin({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static logout = async (req, res, next) => {
        new SUCCESS({
            message: 'Logout successfully',
            metadata: await AccessService.logout({
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = AccessController;