const shopModel = require('../models/shop.model');
const imageModel = require('../models/image.model');
const config = require('../configs/app.config');
const axios = require('axios');
<<<<<<< HEAD
const FormData = require('form-data');
=======
>>>>>>> main

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR
} = require('../core/error.response');
const Utils = require('../utils');

<<<<<<< HEAD
class ImageService {
    static upload = async({ shopId, data }) => {
        const foundShop = await shopModel.findById(shopId);
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found');
        }
        if(!foundShop.active) {
            throw new FORBIDDEN_ERROR('Shop is banned');
        }

        const form = new FormData();
        form.append('image', data.replace(/^data:image\/(png|jpg);base64,/, ""));
        const res = await axios.post('https://api.imgur.com/3/image', form, {
            headers: {
                Authorization: `Bearer ${config.imgur.token}`
            }
        });
        if(res.status !== 200) {
            throw new BAD_REQUEST_ERROR('Upload image failed');
        }
        const newImage = await imageModel.create({
            shop: shopId,
            type: 'imgur',
            hash: res.data.data.id,
            link: res.data.data.link
        });
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'createdAt'],
            object: newImage
        });
    }

    static get = async ({ id }) => {
        const foundImage = await imageModel.findById(id).lean();
        if (!foundImage) return null;
        return foundImage.link;
    }

    static delete = async ({ shopId, id }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if (!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found');
        }
        if(!foundShop.active) {
            throw new FORBIDDEN_ERROR('Shop is banned');
        }
        const foundImage = await imageModel.findById(id).lean();
        if (!foundImage) {
            throw new NOT_FOUND_ERROR('Image not found');
        }
        if(foundImage.shop.toString() !== shopId) {
            throw new UNAUTHENTICATED_ERROR('You are not authorized to delete this image!');
        }
        await imageModel.findByIdAndDelete(id);
        if(foundImage.type === 'imgur') {
            await axios.delete(`https://api.imgur.com/3/image/${foundImage.hash}`, {
                headers: {
                    Authorization: `Bearer ${config.imgur.token}`
                }
            })
        }
        return Utils.OtherUtils.getInfoData({
            fields: ['_id', 'createdAt'],
            object: foundImage
        });
=======
class ImageService {    
    static upload = async({ shopId, userId, file }) => {

    }

    static delete = async () => {

>>>>>>> main
    }
}

module.exports = ImageService;