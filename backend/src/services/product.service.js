const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');
const shopModel = require('../models/shop.model');
const imageModel = require('../models/image.model');
const userModel = require('../models/user.model');
const ROLES = require('../constants/ROLES')
const commentModel = require('../models/comment.model');

const utils = require('../utils');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR
} = require('../core/error.response');

const VariationService = require('./variation.service');
const variationModel = require('../models/variation.model');
class ProductService {

    static searchProduct = async ({ key }) => {
        const products = await productModel.find({ name: { $regex: key, $options: 'i' } })
            .select('_id name price thumbnail category shop likes short_description sell_count')
            .sort({ sell_count: -1 })
            .populate('category', '_id name')
            .populate('sale', '_id name discount')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .lean();

        products.forEach(product => {
            product.sale = product.sale ? product.sale.discount : 0;
            product.likes = product.likes.length;
        })

        return products;
    }

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
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if (!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const foundCategory = await categoryModel.findById(category).lean();
        if (!foundCategory) throw new BAD_REQUEST_ERROR('Category not found!');
        if (foundCategory.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Category not found in this shop!');
        const foundThumbnail = await imageModel.findById(thumbnail).lean();
        if (!foundThumbnail) throw new BAD_REQUEST_ERROR('Thumbnail not found!');
        if (foundThumbnail.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Thumbnail not found in this shop!');
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
        const products = await productModel.find({ shop: shopId })
            .select('_id name category price thumbnail addBy createdAt')
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('addBy', '_id name')
            .lean();
        return products;
    }

    static getProduct = async ({ id, user }) => {
        const product = await productModel.findById(id)
            .populate('category', '_id name')
            .populate('sale', '_id name discount')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .lean();

        const relatedProducts = await productModel.find({
            category: product.category,
            _id: { $ne: id }
        })
            .select('_id name price thumbnail category shop short_description sell_count sale')
            .sort({ sell_count: -1 })
            .populate('sale', '_id name discount')
            .populate('category', '_id name')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .limit(5)
            .lean();

        relatedProducts.forEach(item => {
            item.sale = item.sale ? item.sale.discount : 0;
        });

        product.comments = await commentModel
            .find({ product: id })
            .populate('user', '_id name')
            .lean();

        product.isLike = product.likes.map(id => id.toString()).includes(user);
        product.likes = product.likes.length;
        product.relatedProducts = relatedProducts;
        product.sale = product.sale ? product.sale.discount : 0;

        return utils.OtherUtils.getInfoData({
            fields: ['_id', 'shop', 'name', 'description', 'short_description', 'price', 'sale', 'thumbnail', 'category', 'likes', 'isLike', 'variations', 'rating', 'sell_count', 'relatedProducts', 'comments'],
            object: product
        });
    }

    static switchProductLike = async ({ userId, productId }) => {
        userId = userId.toString();
        const foundProduct = await productModel.findById(productId).lean();
        if (!foundProduct) throw new BAD_REQUEST_ERROR('Product not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const likes = foundProduct.likes.map(String); // Convert all IDs to strings
        const index = likes.indexOf(userId);
        if (index !== -1) {
            likes.splice(index, 1);
        } else {
            likes.push(userId);
        }
        await productModel.findByIdAndUpdate(productId, { likes });
        return this.getProduct({ id: productId, user: userId });
    }


    static getProductsByAdmin = async ({ shopId, userId }) => {
        if (!shopId) throw new BAD_REQUEST_ERROR('Shop not found!')
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if (!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const products = await productModel.find({ shop: shopId })
            .select('_id name category price thumbnail addBy createdAt')
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
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const variations = await variationModel.find({ product: productId }).lean();
        const product = await productModel.findById(productId)
            .populate('category', '_id name')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .lean();
        product.variations = variations;
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
            .select('_id name price thumbnail category shop likes short_description sell_count')
            .populate('category', '_id name')
            .populate('sale', '_id name discount')
            .populate('thumbnail', '_id name')
            .populate('shop', '_id name')
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        products.forEach(product => {
            product.sale = product.sale ? product.sale.discount : 0;
            product.likes = product.likes.length;
        })

        return products;
    }

    static deleteProduct = async ({ shopId, userId, productId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        await productModel.findByIdAndDelete(productId);
        const products = await productModel.find({ shop: shopId })
            .select('_id name category price thumbnail addBy status createdAt')
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('addBy', '_id name')
            .lean();
        return products;
    }

    static updateProduct = async ({ shopId, userId, product }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        const foundUser = await userModel.findById(userId).lean();
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        const foundProduct = await productModel.findById(product._id).lean();
        if (!foundProduct) throw new BAD_REQUEST_ERROR('Product not found!');
        if (foundProduct.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Product not found in this shop!');
        await productModel.findByIdAndUpdate(product._id, {
            name: product.name,
            short_description: product.short_description,
            description: product.description,
            price: product.price,
            sale: product.sale,
        });
        await Promise.all(product.variations.map(async variation => {
            await variationModel.findByIdAndUpdate(variation._id, {
                price: variation.price,
                quantity: variation.quantity
            });
        }))
        const products = await productModel.find({ shop: shopId })
            .select('_id name category price thumbnail addBy createdAt')
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('addBy', '_id name')
            .lean();
        return products;
    }
}

module.exports = ProductService;