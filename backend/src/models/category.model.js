'use strict'

const { Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_categories';
const COLLECTION_NAME = 'categories';

var categorySchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_shops',
        default: null
    },
    name: {
        type: String,
        required: true
    },
    addBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        default: null
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);