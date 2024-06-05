const orderModel = require("../models/order.model");

const {
    BAD_REQUEST_ERROR, NOT_FOUND_ERROR
} = require('../core/error.response');

class OrderService {
    static getOrder = async ({ orderId }) => {
        const foundOrder = await orderModel.findById(orderId);
        if (!foundOrder) throw new NOT_FOUND_ERROR('Order not found');
        if (foundOrder.user?.toString()) throw new BAD_REQUEST_ERROR('You are not allowed to access this order');
        return foundOrder;
    }

    static getOrderByOwner = async ({ userId, orderId }) => {
        const foundOrder = await orderModel.findOne({ user: userId, _id: orderId });
        if (!foundOrder) throw NOT_FOUND_ERROR('Order not found');
        if (foundOrder.user.toString() !== userId) throw new BAD_REQUEST_ERROR('You are not allowed to access this order');
        return foundOrder;
    }

    static getOrdersByOwner = async ({ userId }) => {
        return await orderModel.find({ user: userId });
    }
}

module.exports = OrderService;