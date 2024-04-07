'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_products';
const COLLECTION_NAME = 'products';

const CommentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
})

const VariantSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const AttributeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['variant', 'fixed'],
        default: 'fixed'
    },
    variants: {
        type: [VariantSchema],
        default: []
    }
})

const productSchema = new Schema({
    shopId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
        // user who created this product
    },
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    description:{
        type:String,
        trim: true,
        maxLength: 500
    },
    categories:{
        type:[String],
        default: []
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: []
    },
    score: {
        type: Number,
        default: 0
    },
    comments: {
        type: [CommentSchema],
        default: []
    },
    attributes: {
        type: [AttributeSchema],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'unpublished'],
        default: 'draft'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, productSchema);