'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_users';
const COLLECTION_NAME = 'users';

const userSchema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        trim: true
    },
    password:{
        type:String,
        required:true,
    },
    phone: {
        type: String,
        trim: true,
        required:true,
    },
    address: {
        type: [String],
        default: []
    },
    default_address: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);