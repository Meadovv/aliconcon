const categoryModel = require('../models/category.model')
const shopModel = require('../models/shop.model')
const adminModel = require('../models/admin.model')

const {
    BAD_REQUEST_ERROR,
    UNAUTHENTICATED_ERROR,
    FORBIDDEN_ERROR
} = require('../core/error.response');

class CategoryService {
    static createCategory = async ({ shopId, userId, name, thumbnail, parent }) => {
        let addBy = null;
        if(!parent) {
            addBy = await adminModel.findById({
                _id: userId
            }).lean();
            if(!addBy) {
                throw new BAD_REQUEST_ERROR('You are not authorized to create this category!')
            }
        }
        if(parent) {
            const parentCategory = await categoryModel.findById({
                _id: parent
            }).lean();
            if(!parentCategory) {
                throw new BAD_REQUEST_ERROR('Parent category not found!')
            }
            if(parentCategory.parent) {
                throw new BAD_REQUEST_ERROR('You can not create category under this category!')
            }
        }
        return await categoryModel.create({
            shop: shopId,
            parent: parent,
            name: name,
            thumbnail: thumbnail,
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
        console.log(shopId)
        return await categoryModel.find({
            shop: shopId,
            status: 'draft'
        }).lean();
    }

    static getProducts = async ({ shopId }) => {
        
    }
}

module.exports = CategoryService