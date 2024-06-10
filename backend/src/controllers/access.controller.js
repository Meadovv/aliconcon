'use strict'

const AccessService = require("../services/access.service");

const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')

class AccessController {
    
    static metadata = async (req, res) => {
        return new SUCCESS({
            message: 'Get User Information Successfully!',
            metadata: await AccessService.getMetadata(req.jwt_decode.userId)
        }).send(res);
    }

    static changePassword = async (req, res) => {
        return new SUCCESS({
            message: 'Change password successfully!',
            metadata: await AccessService.changePassword({
                ...getFields({
                    fields: ['oldPassword', 'newPassword'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static forgotPassword = async (req, res) => {
        return new CREATED({
            message: 'Send mail successfully!',
            metadata: await AccessService.forgotPassword({
                ...getFields({
                    fields: ['email'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static logout = async (req, res) => {
        return new SUCCESS({
            message: 'Logout successfully',
            metadata: await AccessService.logout({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static checkMail = async (req, res) => {
        return new SUCCESS({
            message: 'Check mail successfully!',
            metadata: await AccessService.checkMail({
                ...getFields({
                    fields: ['email'],
                    object: req.query
                })
            })
        }).send(res);
    }

    static checkToken = async (req, res) => {
        return new SUCCESS({
            message: 'Check token successfully!',
            metadata: await AccessService.checkToken({
                ...getFields({
                    fields: ['email', 'token'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static passwordReset = async (req, res) => {
        return new SUCCESS({
            message: 'Reset password successfully!',
            metadata: await AccessService.passwordReset({
                ...getFields({
                    fields: ['email', 'token', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }
}

module.exports = AccessController;