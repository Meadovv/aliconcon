const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const variationModel = require("../models/variation.model");
const cartModel = require("../models/cart.model");

const Utils = require("../utils");

const {
    BAD_REQUEST_ERROR, NOT_FOUND_ERROR
} = require('../core/error.response');

class CartService {
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

        return await cartModel.find({ user: userId })
            .select('_id user name quantity')
            .populate('product', '_id name')
            .populate('variation', '_id name price')
            .lean();
    }

    static getCart = async ({ userId }) => {
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) {
            throw new NOT_FOUND_ERROR("User not found");
        }
        return await cartModel.find({ user: userId })
            .select('_id user name quantity')
            .populate('product', '_id name')
            .populate('variation', '_id name price')
            .lean();
    }

    static removeFromCart = async ({ userId, productId, variationId, quantity }) => {
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
        if (quantity > foundCart.quantity) throw new BAD_REQUEST_ERROR("Quantity is more than available quantity");
        if (quantity === foundCart.quantity) {
            await cartModel.findByIdAndDelete(foundCart._id);
        } else {
            const newQuantity = foundCart.quantity - quantity;
            await cartModel.findByIdAndUpdate(foundCart._id, { quantity: newQuantity });
        }
        return await cartModel.find({ user: userId })
            .select('_id user name quantity')
            .populate('product', '_id name')
            .populate('variation', '_id name price')
            .lean();
    }

    static clearCart = async ({ userId }) => {

    }
}

module.exports = CartService;