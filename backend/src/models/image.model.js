'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_image';
const COLLECTION_NAME = 'images';

const schema = new Schema({
    shop:{
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
        required: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);