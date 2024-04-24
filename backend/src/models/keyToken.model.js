'use strict'

const app_config = require('../configs/app.config');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_key';
const COLLECTION_NAME = 'keys';

var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_user',
        required: true
    },
    key: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: app_config.jwt.expired},
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);