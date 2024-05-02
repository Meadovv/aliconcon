const orderModel = require("../models/order.model");
const shopOrder = require("../models/shopOrder.model");

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
        return await orderModel.find({ user: userId }).lean();
    }

    static getOrdersByShop = async ({ shopId }) => {
        return await shopOrder.find({ shop: shopId }).lean();
    }

    static getOrderByShop = async ({ shopId, orderId }) => {
        const foundShopOrder = await shopOrder.findOne({ shop: shopId, _id: orderId }).lean();
        if (!foundShopOrder) throw new NOT_FOUND_ERROR('Order not found');

        const foundOrder = await orderModel.findById(foundShopOrder.order).lean();
        if (!foundOrder) throw new NOT_FOUND_ERROR('Order not found');

        return {
            user: {
                name: foundOrder.user_name,
                phone: foundOrder.user_phone,
                address: foundOrder.user_address
            },
            items: foundShopOrder.items,
            total: foundShopOrder.total,
            status: foundShopOrder.status,
            paid: foundShopOrder.paid,
        }

    }
}

module.exports = OrderService;