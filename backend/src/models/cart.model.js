'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_carts';
const COLLECTION_NAME = 'carts';

const schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        required: true
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_product_variations',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);