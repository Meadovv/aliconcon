'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_product_variations';
const COLLECTION_NAME = 'variations';

const schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_products',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    variation_tier_idx: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);