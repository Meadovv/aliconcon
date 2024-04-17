const productModel = require('../models/product.model');
const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
} = require('../core/error.response');

class ProductService {
    static createProduct = async ({
        shopId,
        userId,
        name,
        description,
        categoryId,
        price,
        thumbnail,
    }) => {
        if(!shopId) {
            throw new UNAUTHENTICATED_ERROR('Shop ID not found!')
        }
        return await productModel.create({
            shop: shopId,
            addBy: userId,
            name: name,
            description: description,
            category: categoryId,
            price: price,
            thumbnail: thumbnail,
        });
    }
}

module.exports = ProductService;