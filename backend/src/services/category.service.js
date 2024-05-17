const categoryModel = require('../models/category.model')
const shopModel = require('../models/shop.model')
const { getInfoData } = require('../utils/other.utils');
const ROLES = require('../constants/ROLES');

const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
    FORBIDDEN_ERROR,
    NOT_FOUND_ERROR
} = require('../core/error.response');

class CategoryService {
    static createCategory = async ({ shopId, userId, name }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }

        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to create category!')
        }

        await categoryModel.create({
            shop: shopId,
            name: name,
            addBy: userId,
            status: 'draft'
        })

        return await categoryModel
            .find({ shop: shopId })
            .populate('shop', '_id name email')
            .populate('addBy', '_id name email')
            .lean();
    }

    static getCategories = async ({ shopId }) => {
        if (!shopId) {
            throw new BAD_REQUEST_ERROR('Shop ID not found!')
        }
        if (shopId === 'all') {
            return await categoryModel.find({
                status: 'draft',
                shop: null,
                parent: null
            }).lean();
        }
        const categories = await categoryModel.find({
            shop: shopId,
            status: 'published',
        }).populate('parent', '_id name shop').lean();
        return categories.filter(category => category.parent.shop === null);
    }

    static getProducts = async ({ shopId }) => {

    }

    static getCategory = async ({ categoryId }) => {
        if (!categoryId) {
            throw new BAD_REQUEST_ERROR('Category ID not found!')
        }
        const category = await categoryModel.findById(categoryId).lean();
        if (!category) {
            throw new NOT_FOUND_ERROR('Category not found!')
        }
        return category;
    }

    static switchCategoryStatus = async ({ categoryId, shopId, userId }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }

        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to switch category status!')
        }

        if(userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) {
            throw new FORBIDDEN_ERROR('You are not authorized to switch category status!')
        }

        const category = await categoryModel.findById(categoryId);
        if (!category) {
            throw new NOT_FOUND_ERROR('Category not found!')
        }

        await categoryModel.findByIdAndUpdate({
            _id: categoryId
        }, {
            status: category.status === 'published' ? 'draft' : 'published'
        })

        return await categoryModel
            .find({ shop: shopId })
            .populate('shop', '_id name email')
            .populate('addBy', '_id name email')
            .lean();
    }
}

module.exports = CategoryService