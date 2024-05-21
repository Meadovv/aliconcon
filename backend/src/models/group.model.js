'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_group';
const COLLECTION_NAME = 'groups';

const schema = new Schema({
    shop:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_shop',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_user',
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