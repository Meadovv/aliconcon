'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'aliconcon_image';
const COLLECTION_NAME = 'images';

const schema = new Schema({
    shop:{
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_shop',
        required: true
    },
<<<<<<< HEAD
    type: {
        type: String,
        enum: ['imgur', 'another'],
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
=======
    addBy: {
        type: Schema.Types.ObjectId,
        ref: 'aliconcon_user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
>>>>>>> main
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, schema);