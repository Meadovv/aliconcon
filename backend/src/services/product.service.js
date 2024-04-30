const productModel = require('../models/product.model');
const shopModel = require('../models/shop.model');
const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
} = require('../core/error.response');

const VariationService = require('./variation.service');
const categoryModel = require('../models/category.model');
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
        variations
    }) => {
        if(!shopId) throw new BAD_REQUEST_ERROR('Shop not found!')
        const foundShop = await shopModel.findById(shopId);
        if(!foundShop) throw new BAD_REQUEST_ERROR('Shop not found!');
        if(!userId) throw new UNAUTHENTICATED_ERROR('Unauthorized Error!');
        const foundUser = await foundShop.users.find(user => user._id.toString() === userId);
        if(!foundUser) throw new UNAUTHENTICATED_ERROR('You are not in this shop!');
        if(foundUser.role > 2) throw new UNAUTHENTICATED_ERROR('You are not allowed to create product!');
        const foundCategory = await categoryModel.findById(category);
        if(!foundCategory) throw new BAD_REQUEST_ERROR('Category not found!');
        if(foundCategory.shop.toString() !== shopId) throw new BAD_REQUEST_ERROR('Category not found in this shop!');
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
}

module.exports = ProductService;