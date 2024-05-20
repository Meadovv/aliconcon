'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_shops';
const COLLECTION_NAME = 'shops';

const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users'
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: Number,
        required: true
    },
    addBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_users',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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