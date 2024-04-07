'use strict'

const { Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_categories';
const COLLECTION_NAME = 'categories';

var categorySchema = new Schema({
    shopId: {
        type: String,
        required: true
    },
    userId : {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);