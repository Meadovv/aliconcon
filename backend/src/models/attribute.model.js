'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_product_attribute';
const COLLECTION_NAME = 'attributes';

const schema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['fixed', 'variant'],
        default: 'fixed'
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);