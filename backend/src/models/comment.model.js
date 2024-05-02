'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_comments';
const COLLECTION_NAME = 'comments';

const schema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_products',
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        required: true
    },
    comment:{
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);