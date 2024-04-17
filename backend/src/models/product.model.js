'use strict'

const { model, Schema, Mongoose } = require('mongoose');

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
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, productSchema);