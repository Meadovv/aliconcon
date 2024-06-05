const UserService = require("../services/user.service");
const CartService = require('../services/cart.service');

const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils');
const OrderService = require("../services/order.service");


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
    static addToCart = async (req, res) => {
        new SUCCESS({
            message: 'Add to cart successfully',
            metadata: await CartService.addToCart({
                ...getFields({
                    fields: ['productId', 'variationId', 'quantity'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getCart = async (req, res) => {
        new SUCCESS({
            message: 'Get cart successfully',
            metadata: await CartService.getCart({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static removeFromCart = async (req, res) => {
        new SUCCESS({
            message: 'Remove from cart successfully',
            metadata: await CartService.removeFromCart({
                ...getFields({
                    fields: ['productId', 'variationId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static clearCart = async (req, res) => {
        new SUCCESS({
            message: 'Clear cart successfully',
            metadata: await CartService.clearCart({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static toggleCart = async (req, res) => {
        new SUCCESS({
            message: 'Toggle cart successfully',
            metadata: await CartService.toggleCart({
                ...getFields({
                    fields: ['productId', 'variationId', 'type'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static checkout = async (req, res) => {
        new SUCCESS({
            message: 'Checkout successfully',
            metadata: await CartService.checkout({
                ...getFields({
                    fields: ['information', 'carts', 'method'],
                    object: req.body
                }),
            })
        }).send(res);
    }

    static getOrder = async (req, res) => {
        new SUCCESS({
            message: 'Get order successfully',
            metadata: await OrderService.getOrder({
                ...getFields({
                    fields: ['orderId'],
                    object: req.query
                }),
            })
        }).send(res);
    }

    static getOrderByOwner = async (req, res) => {
        new SUCCESS({
            message: 'Get order by owner successfully',
            metadata: await OrderService.getOrderByOwner({
                ...getFields({
                    fields: ['orderId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = UserController;