const voucherModel = require('../models/voucher.model');
const shopModel = require('../models/shop.model');
const ROLES = require('../constants/ROLES');
const productModel = require('../models/product.model');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR
} = require('../core/error.response');
const userModel = require('../models/user.model');

class VoucherService {
    static createVoucher = async ({ shopId, userId, name, description, discount, startDate, endDate }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to create voucher!');
        await voucherModel.create({
            shop: shopId,
            addBy: userId,
            name: name,
            description: description,
            discount: discount,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString()
        });
        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate createdAt')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;

    }

    static switchVoucher = async ({ shopId, userId, voucherId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to switch voucher!');
        const foundVoucher = await voucherModel.findById(voucherId).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');
        await voucherModel.findByIdAndUpdate(voucherId, { status: !foundVoucher.status });
        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate createdAt')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }

    static deleteVoucher = async ({ shopId, userId, voucherId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to delete voucher!');
        const foundVoucher = await voucherModel.findById(voucherId).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');
        if (foundVoucher.status) throw new BAD_REQUEST_ERROR('Voucher is active!');
        await voucherModel.findByIdAndDelete(voucherId);
        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate createdAt')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }

    static updateVoucher = async ({ shopId, userId, voucher }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to update voucher!');
        const foundVoucher = await voucherModel.findById(voucher._id).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');
        if (foundVoucher.status) throw new BAD_REQUEST_ERROR('Voucher is active!');
        await voucherModel.findByIdAndUpdate(voucher._id, voucher);
        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate createdAt')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }

    static getVoucher = async ({ shopId, userId, voucherId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to get voucher detail!');
        const foundVoucher = await voucherModel.findById(voucherId).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');
        return foundVoucher;
    }

    static getVouchers = async ({ shopId, userId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to get voucher list!');
        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate createdAt discount')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }

    static addToVoucher = async ({ shopId, userId, voucherId, productId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to add item to voucher!');
        const foundVoucher = await voucherModel.findById(voucherId).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');

        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) throw new BAD_REQUEST_ERROR(`Product not found!`);

        const productInVoucher = foundVoucher.items.find(item => item.item.toString() === itemId);
        if (productInVoucher) throw new BAD_REQUEST_ERROR('Product already in voucher!');

        foundVoucher.items.push({
            _id: productId,
            addBy: userId
        });
        await voucherModel.findByIdAndUpdate(voucherId, foundVoucher);

        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }

    static removeFromVoucher = async ({ shopId, userId, voucherId, itemId, itemType }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new BAD_REQUEST_ERROR('User not found!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) throw new UNAUTHENTICATED_ERROR('You are not allowed to add item to voucher!');
        const foundVoucher = await voucherModel.findById(voucherId).lean();
        if (!foundVoucher) throw new BAD_REQUEST_ERROR('Voucher not found!');

        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) throw new BAD_REQUEST_ERROR(`Product not found!`);

        const productInVoucher = foundVoucher.items.find(item => item.item.toString() === itemId);
        if (!productInVoucher) throw new BAD_REQUEST_ERROR('Product is not in voucher!');

        await voucherModel.findByIdAndDelete(voucherId);

        const vouchers = await voucherModel
            .find({ shop: shopId })
            .select('_id name addBy status startDate endDate')
            .populate('addBy', '_id name')
            .lean();
        return vouchers;
    }
}

module.exports = VoucherService;