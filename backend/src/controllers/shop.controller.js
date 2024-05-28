const {
    CREATED, SUCCESS
} = require('../core/success.response');
const { getFields } = require('../utils/other.utils');
const ShopService = require('../services/shop.service');

const ProductService = require('../services/product.service');
const CategoryService = require('../services/category.service');
const VariationService = require('../services/variation.service');
const GroupService = require('../services/group.service');
const VoucherService = require('../services/voucher.service');

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

    static getUser = async (req, res) => {
        new SUCCESS({
            message: 'Get user successfully!',
            metadata: await ShopService.getUser({
                ...getFields({
                    fields: ['targetId'],
                    object: req.body
                }),
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

    static changeUserRole = async (req, res) => {
        new SUCCESS({
            message: 'Change user role successfully!',
            metadata: await ShopService.changeUserRole({
                ...getFields({
                    fields: ['targetUser'],
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

    static getProducts = async (req, res) => {
        new SUCCESS({
            message: 'Get products successfully',
            metadata: await ProductService.getProducts({
                ...req.query
            })
        }).send(res);
    }

    static getProductsByAdmin = async (req, res) => {
        new SUCCESS({
            message: 'Get products successfully',
            metadata: await ProductService.getProductsByAdmin({
                ...req.jwt_decode
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

    static createGroup = async (req, res) => {
        new SUCCESS({
            message: 'Group created successfully',
            metadata: await GroupService.create({
                ...getFields({
                    fields: ['name'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static deleteGroup = async (req, res) => {
        new SUCCESS({
            message: 'Group deleted successfully',
            metadata: await GroupService.delete({
                ...getFields({
                    fields: ['groupId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static updateGroup = async (req, res) => {
        new SUCCESS({
            message: 'Group updated successfully',
            metadata: await GroupService.update({
                ...getFields({
                    fields: ['groupId', 'name'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static addProductToGroup = async (req, res) => {
        new SUCCESS({
            message: 'Product added to group successfully',
            metadata: await GroupService.addProductToGroup({
                ...getFields({
                    fields: ['groupId', 'productId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static removeProductFromGroup = async (req, res) => {
        new SUCCESS({
            message: 'Product removed from group successfully',
            metadata: await GroupService.removeProductFromGroup({
                ...getFields({
                    fields: ['groupId', 'productId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static viewGroup = async (req, res) => {
        new SUCCESS({
            message: 'View group successfully',
            metadata: await GroupService.viewGroup({
                ...getFields({
                    fields: ['groupId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getGroups = async (req, res) => {
        new SUCCESS({
            message: 'Get groups successfully',
            metadata: await GroupService.getGroups({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getGroup = async (req, res) => {

    }

    static createVoucher = async (req, res) => {
        new CREATED({
            message: 'Voucher created successfully',
            metadata: await VoucherService.createVoucher({
                ...getFields({
                    fields: ['name', 'description', 'startDate', 'endDate', 'amount', 'discount'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static switchVoucher = async (req, res) => {
        new SUCCESS({
            message: 'Switch voucher successfully',
            metadata: await VoucherService.switchVoucher({
                ...getFields({
                    fields: ['voucherId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static deleteVoucher = async (req, res) => {
        new SUCCESS({
            message: 'Voucher deleted successfully',
            metadata: await VoucherService.deleteVoucher({
                ...getFields({
                    fields: ['voucherId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getVoucher = async (req, res) => {
        new SUCCESS({
            message: 'Get voucher successfully',
            metadata: await VoucherService.getVoucher({
                ...getFields({
                    fields: ['voucherId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getVouchers = async (req, res) => {
        new SUCCESS({
            message: 'Get vouchers successfully',
            metadata: await VoucherService.getVouchers({
                ...req.jwt_decode
            })
        }).send(res);
    }

    static addToVoucher = async (req, res) => {
        new SUCCESS({
            message: 'Add to voucher successfully',
            metadata: await VoucherService.addToVoucher({
                ...getFields({
                    fields: ['voucherId', 'itemId', 'itemType'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = ShopController;