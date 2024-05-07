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
        if(!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found!')
        }

        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if(!userInShop) {
            throw new FORBIDDEN_ERROR('You are not authorized to create category!')
        }

        if(userInShop.role > ROLES.SHOP_ADMIN) {
            throw new UNAUTHENTICATED_ERROR('You are not authorized to create category!')
        }

        return await categoryModel.create({
            shop: shopId,
            name: name,
            addBy: userId,
            status: 'draft'
        })
    }

    static getCategories = async ({ shopId }) => {
        if(!shopId) {
            throw new BAD_REQUEST_ERROR('Shop ID not found!')
        }
        if(shopId === 'all') {
            return await categoryModel.find({
                status: 'draft',
                shop: null,
                parent: null
            }).lean();
        }
        const categories = await categoryModel.find({
            shop: shopId,
            status: 'draft'
        }).populate('parent', '_id name shop').lean();
        return categories.filter(category => category.parent.shop === null);
    }

    static getProducts = async ({ shopId }) => {
        
    }

    static getCategory = async ({ categoryId }) => {
        let category = await categoryModel.findById(categoryId)
          .populate('parent')
          .lean();
      
        let parents = [getInfoData({
            fields: ['_id', 'name', 'level'],
            object: category
        })];
        while (category.parent) {
          parents.push(getInfoData({
            fields: ['_id', 'name', 'level'],
            object: category.parent
          }));
          category = await categoryModel.findById(category.parent)
            .populate('parent')
            .lean();
        }
      
        return parents;
      }
}

module.exports = CategoryService