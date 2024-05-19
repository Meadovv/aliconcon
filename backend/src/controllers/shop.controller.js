const {
    CREATED, SUCCESS
} = require('../core/success.response');
const { getFields } = require('../utils/other.utils');
const ShopService = require('../services/shop.service');

const ProductService = require('../services/product.service');
const CategoryService = require('../services/category.service');
const VariationService = require('../services/variation.service');
const ImageService = require('../services/image.service');

class ShopController {

    static metadata = async (req, res) => {
        return new SUCCESS({
            message: 'Metadata successfully!',
            metadata: await ShopService.metadata({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static login = async (req, res) => {
        return new SUCCESS({
            message: 'Login successfully!',
            metadata: await ShopService.login({
                ...getFields({
                    fields: ['email', 'shopEmail', 'password'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static register = async (req, res) => {
        return new CREATED({
            message: 'Shop created successfully!',
            metadata: await ShopService.register({
                ...getFields({
                    fields: ['name', 'email', 'password', 'address', 'phone', 'shopName', 'shopEmail', 'shopAddress'],
                    object: req.body
                })
            })
        }).send(res);
    }

    static addUser = async (req, res) => {
        new CREATED({
            message: 'User added successfully!',
            metadata: await ShopService.addUser({
                ...getFields({
                    fields: ['targetEmail', 'targetRole'],
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
                    fields: ['targetEmail'],
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

    static switchUserStatus = async (req, res) => {
        new SUCCESS({
            message: 'Switch user status successfully!',
            metadata: await ShopService.switchUserStatus({
                ...getFields({
                    fields: ['targetId'],
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
                    fields: ['name'],
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

    static updateCategory = async (req, res) => {
        new SUCCESS({
            message: 'Category updated successfully',
            metadata: await CategoryService.updateCategory({
                ...getFields({
                    fields: ['category'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static createProduct = async (req, res) => {
        new CREATED({
            message: 'Product created successfully',
            metadata: await ProductService.createProduct({
                ...getFields({
                    fields: ['name', 'description', 'short_description', 'price', 'category', 'thumbnail', 'variations'],
                    object: req.body
                }), ...req.jwt_decode
            })
        }).send(res);
    }

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

    static deleteProduct = async (req, res) => {
        new SUCCESS({
            message: 'Product deleted successfully',
            metadata: await ProductService.deleteProduct({
                ...getFields({
                    fields: ['productId'],
                    object: req.body
                }), ...req.jwt_decode
            })
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

    static getCategory = async (req, res) => {
        new SUCCESS({
            message: 'Get category successfully',
            metadata: await CategoryService.getCategory({
                ...getFields({
                    fields: ['categoryId'],
                    object: req.query
                })
            })
        }).send(res);
    }

    static getCategoryByAdmin = async (req, res) => {
        new SUCCESS({
            message: 'Get category successfully',
            metadata: await CategoryService.getCategoryByAdmin({
                ...getFields({
                    fields: ['categoryId'],
                    object: req.body
                }),
                ...req.jwt_decode
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

    static uploadImage = async (req, res) => {
        new CREATED({
            message: 'Image uploaded successfully',
            metadata: await ImageService.upload({
                ...getFields({
                    fields: ['data'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getImage = async (req, res) => {
        const imageUrl = await ImageService.get({
            ...getFields({
                fields: ['id'],
                object: req.query
            })
        });
        
        if (!imageUrl) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        
        // Send the image URL
        res.redirect(imageUrl);
    }

    static deleteImage = async (req, res) => {
        new SUCCESS({
            message: 'Image deleted successfully',
            metadata: await ImageService.delete({
                ...getFields({
                    fields: ['id'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }
    
    static getCategoriesByAdmin = async (req, res) => {
        new SUCCESS({
            message: 'Get categories successfully',
            metadata: await CategoryService.getCategoriesByAdmin({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static switchCategoryStatus = async (req, res) => {
        new SUCCESS({
            message: 'Switch category status successfully',
            metadata: await CategoryService.switchCategoryStatus({
                ...getFields({
                    fields: ['categoryId'],
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
}

module.exports = ShopController;