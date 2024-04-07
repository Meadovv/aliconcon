'use strict'

const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')

const CategoryService = require('../services/category.service')

class CategoryController {
    static createCategory = async (req, res) => {
        new CREATED({
            message: 'Category created successfully',
            metadata: await CategoryService.createCategory({
                ...getFields({
                    fields: ['name', 'thumbnail'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getCategoryByShop = async (req, res) => {
        console.log(req.body)
        new SUCCESS({
            message: 'Get shop categories successfully',
            metadata: await CategoryService.getCategoryByShop({
                ...getFields({
                    fields: ['shopId'],
                    object: req.body
                })
            })
        }).send(res);
    }
    
    static updateCategory = async (req, res) => {

    }

    static deleteCategory = async (req, res) => {
        new SUCCESS({
            message: 'Delete shop category successfully',
            metadata: await CategoryService.deleteById({ 
                ...getFields({ 
                    fields: ['categoryId'], 
                    object: req.body 
                }),
                ...req.jwt_decode 
            })
        }).send(res);
    }
}

module.exports = CategoryController