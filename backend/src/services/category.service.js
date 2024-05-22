const categoryModel = require('../models/category.model')
const shopModel = require('../models/shop.model')
const productModel = require('../models/product.model')
const ROLES = require('../constants/ROLES');
const Utils = require('../utils');

const {
    BAD_REQUEST_ERROR,
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
        const categories = await categoryModel
            .find({ shop: shopId })
            .select('_id name')
            .lean();

        // Add product count to each category
        for (let category of categories) {
            category.products = await productModel.countDocuments({ category: category._id });
        }

        return categories;
    }

    static getCategory = async ({ categoryId }) => {
        if (!categoryId) {
            throw new BAD_REQUEST_ERROR('Category ID not found!')
        }
        const category = await categoryModel.findById(categoryId).lean();
        if (!category) {
            throw new NOT_FOUND_ERROR('Category not found!')
        }
        if (category.status === 'draft') {
            throw new FORBIDDEN_ERROR('Category is not published!')
        }
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'name', 'shop'],
            object: category
        });
    }

    static getCategoryByAdmin = async ({ shopId, userId, categoryId }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to get category!')
        }
        const category = await categoryModel
            .findById(categoryId)
            .populate('addBy', '_id name email')
            .lean();
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

        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) {
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
            .populate('addBy', '_id name email')
            .lean();
    }

    static getCategoriesByAdmin = async ({ shopId, userId }) => {
        if (!shopId) {
            throw new BAD_REQUEST_ERROR('Shop ID not found!');
        }
        const categories = await categoryModel
            .find({ shop: shopId })
            .populate('addBy', '_id name email')
            .lean();
        return categories;
    }

    static deleteCategory = async ({ shopId, userId, categoryId }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }

        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to switch category status!')
        }

        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) {
            throw new FORBIDDEN_ERROR('You are not authorized to delete category!')
        }

        const foundCategory = await categoryModel.findById(categoryId).lean();
        if (foundCategory.status === 'published') {
            throw new FORBIDDEN_ERROR('You are not authorized to delete published category!')
        }

        await categoryModel.findByIdAndDelete(categoryId);
        const categories = await categoryModel
            .find({ shop: shopId })
            .populate('addBy', '_id name email')
            .lean();
        return categories;
    }

    static updateCategory = async ({ shopId, userId, category }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if (!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to update category!')
        }
        if (userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) {
            throw new FORBIDDEN_ERROR('You are not authorized to update category!')
        }
        const foundCategory = await categoryModel.findById(category._id);
        if (!foundCategory) {
            throw new NOT_FOUND_ERROR('Category not found!')
        }
        await categoryModel.findByIdAndUpdate({
            _id: category._id
        }, category)
        return await categoryModel
            .find({ shop: shopId })
            .populate('addBy', '_id name email')
            .lean();
    }
}

module.exports = CategoryService