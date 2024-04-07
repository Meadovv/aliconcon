'use strict'

const { Schema, model} = require('mongoose');

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
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);