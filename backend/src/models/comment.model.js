'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_comment';
const COLLECTION_NAME = 'comments';

const schema = new Schema({
    product:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_product',
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_user',
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);