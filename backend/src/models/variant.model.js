'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_product_variant';
const COLLECTION_NAME = 'variants';

const schema = new Schema({
    attribute:{
        type: Schema.Types.ObjectId,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);