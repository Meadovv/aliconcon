'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_vouchers';
const COLLECTION_NAME = 'vouchers';

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
    description: {
        type: String,
        required: true
    },
    items: {
        type: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'aliconcon_products',
                required: true
            },
            addBy: {
                type: Schema.Types.ObjectId,
                ref: 'aliconcon_users',
                required: true
            }
        }],
        default: []
    },
    discount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);