const categoryModel = require('../models/category.model');
const productModel = require('../models/product.model');

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
        const foundUser = await foundShop.users.find(user => user._id.toString() === userId);
        if (!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if (foundUser.role > 2) throw new UNAUTHENTICATED_ERROR('You are not allowed to create product!');
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

    static getProduct = async ({ id, user }) => {
        const product = await productModel.findById(id)
            .populate({
                path: 'category',
                select: '_id name'
            })
            .populate('shop', '_id name')
            .lean();
        product.isLike = product.likes.map(id => id.toString()).includes(user);
        product.likes = product.likes.length;
        return product;
    }

    static deleteProduct = async ({ productId }) => {
        
    }
}

module.exports = ProductService;