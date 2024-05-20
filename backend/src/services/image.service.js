const shopModel = require('../models/shop.model');
const imageModel = require('../models/image.model');
const config = require('../configs/app.config');
const axios = require('axios');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR
} = require('../core/error.response');
const Utils = require('../utils');

class ImageService {    
    static upload = async({ shopId, userId, file }) => {

    }

    static delete = async () => {

    }
}

module.exports = ImageService;