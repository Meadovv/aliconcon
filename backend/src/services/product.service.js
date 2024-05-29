const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const shopModel = require('../models/shop.model');
const groupModel = require('../models/group.model');
const voucherModel = require('../models/voucher.model');
const ROLES = require('../constants/ROLES')

const utils = require('../utils');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR
} = require('../core/error.response');

const VariationService = require('./variation.service');
class ProductService {
    static createProduct = async ({
        shopId,
        userId,
        name,
        description,
        short_description,
        category,
        price,
        thumbnail,
        variations,
    }) => {
        if (!shopId) throw new BAD_REQUEST_ERROR('Shop not found!')
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if (!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = foundShop.users.find(user => user._id.toString() === userId);
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const foundCategory = await categoryModel.findById(category);
        if (!foundCategory) throw new BAD_REQUEST_ERROR('Category not found!');
        if (foundCategory.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Category not found in this shop!');
        const newProduct = await productModel.create({
            shop: shopId,
            addBy: userId,
            name: name,
            description: description,
            short_description: short_description,
            category: category,
            price: price,
            thumbnail: thumbnail,
            variations: variations
        });
        await VariationService.createVariations(newProduct);
        return newProduct;
    }

    static switchProduct = async ({ shopId, userId, productId }) => {

    }

    static getProduct = async ({ id, user }) => {
        const product = await productModel.findById(id)
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .populate('groups.group', '_id name')
            .lean();

        // sale Price
        product.sale = 0;

        // kiểm tra xem product có giảm giá không

        const productVouchers = await voucherModel.find({
            items: {
                $elemMatch: {
                    kind: 'aliconcon_products',
                    item: id
                }
            },
            startDate: { $lt: new Date() },
            endDate: { $gt: new Date() }
        })
            .select('_id startDate endDate discount amount used')
            .sort({ discount: -1 })
            .limit(1)
            .lean();



        const groupVouchers = await Promise.all(product.groups.map(async group => {
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

            return voucher[0];
        }));

        const allVouchers = [...productVouchers, ...groupVouchers];
        if (allVouchers.length) {
            product.sale = allVouchers.reduce((max, voucher) => voucher.discount > max.discount ? voucher : max, allVouchers[0]).discount;
        }

        product.isLike = product.likes.map(id => id.toString()).includes(user);
        product.likes = product.likes.length;
        return utils.OtherUtils.getInfoData({
            fields: ['_id', 'shop', 'name', 'description', 'short_description', 'price', 'sale', 'thumbnail', 'category', 'likes', 'isLike', 'variations'],
            object: product
        });
    }

    static getProductsByAdmin = async ({ shopId, userId }) => {
        if (!shopId) throw new BAD_REQUEST_ERROR('Shop not found!')
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if (!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = foundShop.users.find(user => user._id.toString() === userId);
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const products = await productModel.find({ shop: shopId })
            .select('_id name category price thumbnail addBy')
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('addBy', '_id name')
            .lean();
        return products;
    }

    static getProductByAdmin = async ({ shopId, userId, productId }) => {
        if (!shopId) throw new BAD_REQUEST_ERROR('Shop not found!')
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if (!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = foundShop.users.find(user => user._id.toString() === userId);
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const product = await productModel.findById(productId)
            .populate('category', '_id name')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .lean();
        return product;
    }

    static getProducts = async ({ shop, category, low_price, high_price, page, limit }) => {
        let query = {};
        if (shop) {
            query.shop = shop;
        }
        if (Number(limit) > 50) {
            limit = 50;
        }
        if (category) {
            query.category = category;
        }
        if (low_price) {
            query.price = { ...query?.price, $gte: Number(low_price) };
        }
        if (high_price) {
            query.price = { ...query?.price, $lte: Number(high_price) };
        }
        const products = await productModel.find(query)
            .select('_id name price thumbnail category shop groups likes')
            .populate('category', '_id name')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        const productsWithSale = await Promise.all(products.map(async product => {
            product.sale = 0;
            const productVouchers = await voucherModel.find({
                items: {
                    $elemMatch: {
                        kind: 'aliconcon_products',
                        item: product._id
                    }
                },
                startDate: { $lt: new Date() },
                endDate: { $gt: new Date() }
            })
                .select('_id startDate endDate discount amount used')
                .sort({ discount: -1 })
                .limit(1)
                .lean();
    
    
    
            const groupVouchers = await Promise.all(product.groups.map(async group => {
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
    
                return voucher[0];
            }));
    
            const allVouchers = [...productVouchers, ...groupVouchers];
            if (allVouchers.length) {
                product.sale = allVouchers.reduce((max, voucher) => voucher.discount > max.discount ? voucher : max, allVouchers[0]).discount;
            }
            product.likes = product.likes.length;
            product.groups = undefined
            return product;
        }));
        return productsWithSale;
    }

    static deleteProduct = async ({ productId }) => {

    }
}

module.exports = ProductService;