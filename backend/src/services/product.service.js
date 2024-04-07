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
        categories,
        price,
        thumbnail,
        images,
        attributes
    }) => {
        if(!shopId) {
            throw new UNAUTHENTICATED_ERROR('Shop ID not found!')
        }
        return await productModel.create({
            shopId,
            userId,
            name,
            description,
            categories,
            price,
            thumbnail,
            images,
            attributes
        });
    }
}

module.exports = ProductService;