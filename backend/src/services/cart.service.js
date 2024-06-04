const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const variationModel = require("../models/variation.model");
const cartModel = require("../models/cart.model");
const voucherModel = require("../models/voucher.model");

const {
    BAD_REQUEST_ERROR, NOT_FOUND_ERROR
} = require('../core/error.response');

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
                select: '_id name thumbnail groups',
                populate: { path: 'thumbnail', select: '_id name' }
            })
            .populate('variation', '_id name price')
            .lean();

        const cartItems = await Promise.all(carts.map(async (item) => {
            // sale Price
            let sale = 0;

            // kiểm tra xem product có giảm giá không
            const productVouchers = await voucherModel.find({
                items: {
                    $elemMatch: {
                        kind: 'aliconcon_products',
                        item: item.product._id
                    }
                },
                startDate: { $lt: new Date() },
                endDate: { $gt: new Date() }
            })
                .select('_id startDate endDate discount amount used')
                .sort({ discount: -1 })
                .limit(1)
                .lean();

            const groupVouchers = await Promise.all(item.product.groups.map(async group => {
                const groupId = group.group._id.toString();

                const voucher = await voucherModel.find({
                    items: {
                        $elemMatch: {
                            kind: 'aliconcon_groups',
                            item: groupId
                        }
                    },
                    startDate: { $lt: new Date() },
                    endDate: { $gt: new Date() }
                })
                    .select('_id startDate endDate discount amount used')
                    .sort({ discount: -1 })
                    .limit(1)
                    .lean();
                return voucher.length > 0 ? voucher[0] : null;
            }));

            const allVouchers = [...productVouchers, ...groupVouchers];
            if (allVouchers.length) {
                let maxDiscount = 0;
                allVouchers.forEach(voucher => {
                    if (!voucher) return;
                    maxDiscount = Math.max(maxDiscount, voucher.discount);
                })
                sale = maxDiscount;
            }
            return {
                product: {
                    ...item.product,
                    sale: sale,
                    groups: undefined
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
}

module.exports = CartService;