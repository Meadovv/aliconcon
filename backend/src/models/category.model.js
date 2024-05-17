'use strict'

const { Schema, model} = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_categories';
const COLLECTION_NAME = 'categories';

const historySchema = new Schema({
    action: {
        type: String,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        default: null
    }
}, {
    timestamps: true
});

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
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    history: {
        type: [historySchema],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, categorySchema);