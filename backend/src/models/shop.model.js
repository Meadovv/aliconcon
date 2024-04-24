'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_shops';
const COLLECTION_NAME = 'shops';

const shopUser = new Schema({
    email: {
        type:String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    addBy: {
        type: Schema.Types.ObjectId,
    }
}, {
    timestamps: true
})


const shopSchema = new Schema({
    name:{
        type:String,
        trim: true,
        required: true
    },
    email:{
        type:String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    users: {
        type: [shopUser],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopSchema);