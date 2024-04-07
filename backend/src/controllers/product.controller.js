
const {
    CREATED, SUCCESS
} = require('../core/success.response')
const ProductService = require('../services/product.service')

class ProductController {
    static getProducts = async (req, res) => {

    }

    static getProduct = async (req, res) => {

    }

    static createProduct = async (req, res) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct({...req.body, ...req.jwt_decode })
        }).send(res);
    }

    static updateProduct = async (req, res) => {

    }

    static deleteProduct = async (req, res) => {

    }

    static getProductsByCategory = async (req, res) => {

    }

    static getProductsByShop = async (req, res) => {

    }
}

module.exports = ProductController;