'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_shops';
const COLLECTION_NAME = 'shops';

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
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
        type: [userSchema],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopSchema);