const {
    SUCCESS
} = require('../core/success.response');
const ProductService = require('../services/product.service');
const { getFields } = require('../utils/other.utils');

class ProductController {
    static getProduct = async (req, res) => {
        new SUCCESS({
            message: 'Get product successfully!',
            metadata: await ProductService.getProduct({
                ...getFields({
                    fields: ['id', 'user'],
                    object: req.query
                })
            })
        }).send(res);
    }
}

module.exports = ProductController;