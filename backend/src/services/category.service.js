const categoryModel = require('../models/category.model')
const shopModel = require('../models/shop.model')

const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
    FORBIDDEN_ERROR
} = require('../core/error.response');

class CategoryService {
    static createCategory = async ({ shopId, userId, name, thumbnail }) => {
        if(!shopId) {
            throw new UNAUTHENTICATED_ERROR('Shop ID not found!')
        }
        return await categoryModel.create({
            shopId, userId, name, thumbnail
        })
    }

    static getCategoryByShop = async ({ shopId }) => {
        if(!shopId) {
            throw new BAD_REQUEST_ERROR('Shop ID not found!')
        }
        return await categoryModel.find({
            shopId: shopId
        })
    }

    static deleteById = async ({ shopId, userId, categoryId }) => {
        if(!shopId) {
            throw new UNAUTHENTICATED_ERROR('Shop ID not found!')
        }
        const foundCategory = await categoryModel.findById({
            _id: categoryId
        })
        if(!foundCategory) {
            throw new BAD_REQUEST_ERROR('Category not found!')
        }
        if(foundCategory.shopId !== shopId) {
            throw new UNAUTHENTICATED_ERROR('This shop does not own this category!')
        }

        const foundShop = await shopModel.findById(shopId)
        if(!foundShop) {
            throw new BAD_REQUEST_ERROR('Shop not found!')
        }

        const user = foundShop.users.find(user => user._id == userId)
        if(!user) {
            throw new UNAUTHENTICATED_ERROR('You are not a member of this shop!')
        }

        if(user.role > 1) {
            throw new FORBIDDEN_ERROR('You do not have permission to do this action');
        }

        return await categoryModel.deleteOne({
            _id: categoryId
        })
    }
}

module.exports = CategoryService