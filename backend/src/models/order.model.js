'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_orders';
const COLLECTION_NAME = 'orders';

const schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        default: null
    },
    user_name: {
        type: String,
        required: true
    },
    user_phone: {
        type: String,
        required: true
    },
    user_address: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    method: {
        type: Number,
        enum: [0, 1],
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        required: true
    },
    paid: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);