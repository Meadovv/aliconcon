'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_products';
const COLLECTION_NAME = 'products';

const productSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        required: true
    },
    addBy: {
        type: Schema.Types.ObjectId,
        required: true
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
    category:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_categories',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    variations: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, productSchema);