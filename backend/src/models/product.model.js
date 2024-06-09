'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_products';
const COLLECTION_NAME = 'products';

const productSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_shops',
        required: true
    },
    addBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        required: true
    },
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    short_description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_categories',
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    sale: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_vouchers',
        default: null
    },
    thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_images',
        required: true,
    },
    rating: {
        type: Number,
        default: 0.0
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'aliconcon_users'
        }],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    variations: {
        type: Array,
        default: []
    },
    sell_count: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, productSchema);