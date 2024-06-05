const UserService = require("../services/user.service");

const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')


class UserController {

    static metadata = async (req, res) => {
        return new SUCCESS({
            message: 'Metadata successfully!',
            metadata: await UserService.metadata({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static login = async (req, res) => {
        return new SUCCESS({
            message: 'Login successfully!',
            metadata: await UserService.login({
                ...getFields({
                    fields: ['email', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static register = async (req, res) => {
        return new CREATED({
            message: 'User created successfully!',
            metadata: await UserService.register({
                ...getFields({
                    fields: ['name', 'email', 'password', 'address', 'phone'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static leaveComment = async (req, res) => {
        new CREATED({
            message: 'Comment created successfully',
            metadata: await UserService.leaveComment({
                ...getFields({
                    fields: ['productId', 'comment'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getComments = async (req, res) => {
        new SUCCESS({
            message: 'Get comment successfully',
            metadata: await UserService.getComment({
                ...getFields({
                    fields: ['productId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getInformation = async (req, res) => {
        new SUCCESS({
            message: 'Get information successfully',
            metadata: await UserService.getInformation({
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = UserController;