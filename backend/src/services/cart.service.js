const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const shopModel = require("../models/shop.model");
const variationModel = require("../models/variation.model");
const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const shopOrderModel = require("../models/shopOrder.model");

const {
    BAD_REQUEST_ERROR, NOT_FOUND_ERROR
} = require('../core/error.response');
const MailerService = require("./mail.service");

class CartService {

    static getCart = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        const carts = await cartModel
            .find({ user: userId })
            .populate({
                path: 'product',
                select: '_id name thumbnail',
                populate: { path: 'thumbnail', select: '_id name' }
            })
            .populate('variation', '_id name price')
            .lean();

        const cartItems = await Promise.all(carts.map(async (item) => {
            const foundProduct = await productModel
                .findById(item.product._id)
                .populate('sale', '_id name discount')
                .lean();
            return {
                product: {
                    ...item.product,
                    sale: foundProduct.sale ? foundProduct.sale.discount : 0
                },
                variation: item.variation,
                quantity: item.quantity,
            };
        }));

        return cartItems;
    }

    static toggleCart = async ({ userId, productId, variationId, type }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) {
            throw new NOT_FOUND_ERROR("Product not found");
        }
        const foundVariation = await variationModel.findById(variationId).lean();
        if (!foundVariation) {
            throw new NOT_FOUND_ERROR("Variation not found");
        }
        const foundCart = await cartModel.findOne({ product: productId, variation: variationId, user: userId }).lean();
        if (!foundCart) {
            throw new NOT_FOUND_ERROR("Product not found in cart");
        }
        if (type) {
            if (foundCart.quantity > foundVariation.quantity) throw new BAD_REQUEST_ERROR("Quantity is more than available quantity");
            await cartModel.findByIdAndUpdate(foundCart._id, { quantity: foundCart.quantity + 1 });
        } else {
            if (foundCart.quantity < 1) throw new BAD_REQUEST_ERROR("Quantity must be greater than 0");
            await cartModel.findByIdAndUpdate(foundCart._id, { quantity: foundCart.quantity - 1 });
        }
        return await this.getCart({ userId });
    }

    static addToCart = async ({ userId, productId, variationId, quantity }) => {
        if (quantity <= 0) throw new BAD_REQUEST_ERROR("Quantity must be greater than 0");
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) {
            throw new NOT_FOUND_ERROR("Product not found");
        }
        const foundVariation = await variationModel.findById(variationId).lean();
        if (!foundVariation) {
            throw new NOT_FOUND_ERROR("Variation not found");
        }
        if (foundVariation.product.toString() !== foundProduct._id.toString()) {
            throw new BAD_REQUEST_ERROR("Variation is not belong to this product");
        }
        const foundCart = await cartModel.findOne({ product: productId, variation: variationId, user: userId }).lean();
        if (foundCart) {
            const newQuantity = foundCart.quantity + quantity;
            if (newQuantity > foundVariation.quantity) throw new BAD_REQUEST_ERROR("Quantity is more than available quantity");
            await cartModel.findByIdAndUpdate(foundCart._id, { quantity: newQuantity });
        } else {
            if (quantity > foundVariation.quantity) throw new BAD_REQUEST_ERROR("Quantity is more than available quantity");
            await cartModel.create({
                user: userId,
                product: productId,
                variation: variationId,
                quantity: quantity
            });
        }

        return await this.getCart({ userId });
    }

    static removeFromCart = async ({ userId, productId, variationId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) {
            throw new NOT_FOUND_ERROR("Product not found");
        }
        const foundVariation = await variationModel.findById(variationId).lean();
        if (!foundVariation) {
            throw new NOT_FOUND_ERROR("Variation not found");
        }
        const foundCart = await cartModel.findOne({ product: productId, variation: variationId, user: userId }).lean();
        if (!foundCart) {
            throw new NOT_FOUND_ERROR("Product not found in cart");
        }
        await cartModel.findByIdAndDelete(foundCart._id);
        return await this.getCart({ userId });
    }

    static clearCart = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        await cartModel.deleteMany({ user: userId });
        return await this.getCart({ userId });
    }

    static checkout = async ({ information, carts }) => {
        let totalCash = 0;

        if (information.userId) {
            const foundUser = await userModel.findById(information.userId).lean();
            if (!foundUser) {
                throw new NOT_FOUND_ERROR("User not found");
            }
        }

        const cartItems = await Promise.all(carts.map(async (item) => {
            const foundProduct = await productModel
                .findById(item.product._id)
                .populate('sale', '_id name discount')
                .lean();
            if (!foundProduct) {
                throw new NOT_FOUND_ERROR("Product not found");
            }
            const foundVariation = await variationModel.findById(item.variation._id).lean();
            if (!foundVariation) {
                throw new NOT_FOUND_ERROR("Variation not found");
            }
            if (foundVariation.product.toString() !== foundProduct._id.toString()) {
                throw new BAD_REQUEST_ERROR("Variation is not belong to this product");
            }
            if (item.quantity > foundVariation.quantity) {
                throw new BAD_REQUEST_ERROR("Quantity is more than available quantity");
            }
            totalCash += (foundVariation.price - (foundVariation.price * (foundProduct.sale ? foundProduct.sale.discount : 0) / 100)) * item.quantity;
            return item;
        }));

        await Promise.all(carts.map(async (item) => {
            const foundProduct = await productModel.findById(item.product._id).lean();
            const foundVariation = await variationModel.findById(item.variation._id).lean();
            await productModel.findByIdAndUpdate(foundProduct._id, { sell_count: foundProduct.sell_count + item.quantity });
            await variationModel.findByIdAndUpdate(foundVariation._id, { quantity: foundVariation.quantity - item.quantity });
            if (information.userId) await cartModel.findOneAndDelete({ product: foundProduct._id, variation: foundVariation._id, user: information.userId });
        }));

        const order = await orderModel.create({
            user: information.userId ? information.userId : null,
            user_name: information.name,
            user_phone: information.phone,
            user_address: information.address,
            items: cartItems,
            total: totalCash
        });

        const shopMap = new Map();
        await Promise.all(cartItems.map(async (item) => {
            const foundProduct = await productModel.findById(item.product._id).lean();
            const foundShop = await shopModel.findById(foundProduct.shop).lean();
            if (!shopMap.has(foundShop._id.toString())) {
                shopMap.set(foundShop._id.toString(), []);
            }
            const shopItems = shopMap.get(foundShop._id.toString());
            shopItems.push(item);
        }));

        await Promise.all(Array.from(shopMap.keys()).map(async (shopId) => {
            await shopOrderModel.create({
                shop: shopId,
                order: order._id,
                items: shopMap.get(shopId),
                total: shopMap.get(shopId).reduce((acc, item) => {
                    const foundVariation = item.variation;
                    const foundProduct = item.product;
                    return acc + (foundVariation.price - (foundVariation.price * (foundProduct.sale ? foundProduct.sale : 0) / 100)) * item.quantity;
                }, 0)
            })
        }));
        MailerService.sendOrderEmail({ to: information.phone, name: information.name, order: order._id });
        return order;
    }
}

module.exports = CartService;