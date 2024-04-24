const {
    CREATED, SUCCESS
} = require('../core/success.response');
const { getFields } = require('../utils/other.utils');
const ShopService = require('../services/shop.service');
const CategoryService = require('../services/category.service')
const ProductService = require('../services/product.service')
const VariationService = require('../services/variation.service')

class ShopController {
    static addUser = async (req, res) => {
        new CREATED({
            message: 'User added successfully!',
            metadata: await ShopService.addUser({
                ...getFields({
                    fields: ['target_email', 'target_password', 'target_role'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static deleteUser = async (req, res) => {
        new SUCCESS({
            message: 'User deleted successfully!',
            metadata: await ShopService.deleteUser({
                ...getFields({
                    fields: ['target_email'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getUserList = async (req, res) => {
        new SUCCESS({
            message: 'Get user list successfully!',
            metadata: await ShopService.getUserList({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static changePassword = async (req, res) => {
        new SUCCESS({
            message: 'Change password successfully!',
            metadata: await ShopService.changePassword({
                ...getFields({
                    fields: ['old_password', 'new_password'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static createCategory = async (req, res) => {
        new CREATED({
            message: 'Category created successfully',
            metadata: await CategoryService.createCategory({
                ...getFields({
                    fields: ['name', 'parent'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static deleteCategory = async (req, res) => {
        new SUCCESS({
            message: 'Category deleted successfully',
            metadata: await CategoryService.deleteCategory({
                ...getFields({
                    fields: ['categoryId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static createProduct = async (req, res) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct({ ...req.body, ...req.jwt_decode })
        }).send(res);
    }

    static deleteProduct = async (req, res) => {
        new SUCCESS({
            message: 'Product deleted successfully',
            metadata: await ProductService.deleteProduct({ ...req.body, ...req.jwt_decode })
        }).send(res);
    }

    static getCategories = async (req, res) => {
        new SUCCESS({
            message: 'Get shop categories successfully',
            metadata: await CategoryService.getCategories({
                ...getFields({
                    fields: ['shopId'],
                    object: req.query
                })
            })
        }).send(res);
    }

    static getProducts = async (req, res) => {
        new SUCCESS({
            message: 'Get products successfully',
            metadata: await CategoryService.getProducts({
                ...getFields({
                    fields: ['shopId', 'categoryId'],
                    object: req.query
                })
            })
        }).send(res);
    }

    static getVariation = async (req, res) => {
        new SUCCESS({
            message: 'Get variation successfully',
            metadata: await VariationService.getVariation({
                ...getFields({
                    fields: ['productId', 'variation_tier_idx'],
                    object: req.body
                })
            })
        }).send(res);
    }
}

module.exports = ShopController;