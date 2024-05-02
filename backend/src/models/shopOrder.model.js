'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_shop_orders';
const COLLECTION_NAME = 'shop_orders';

const schema = new Schema({
    shop:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_shops',
        required: true
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_orders',
        required: true
    },
    items: {
        type: Array,
        default: []
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0
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