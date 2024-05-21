const shopModel = require('../models/shop.model');
const imageModel = require('../models/image.model');

const {
    BAD_REQUEST_ERROR, UNAUTHENTICATED_ERROR, NOT_FOUND_ERROR, FORBIDDEN_ERROR
} = require('../core/error.response');
const ROLES = require('../constants/ROLES');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const path = require('path');

class ImageService {    
    static upload = async({ shopId, userId, file }) => {
        if(!file) {
            throw new BAD_REQUEST_ERROR('File is required');
        }
        const foundShop = await shopModel.findById(shopId).lean();
        if(!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if(!userInShop) {
            throw new FORBIDDEN_ERROR('User is not in shop');
        }
        await imageModel.create({
            shop: shopId,
            addBy: userId,
            name: file.filename
        });
        const images = await imageModel.find({ shop: shopId }).select('name').lean();
        return images;
    }

    static delete = async ({ shopId, userId, imageId }) => {
        const foundShop = await shopModel.findById(shopId).lean();
        if(!foundShop) {
            throw new NOT_FOUND_ERROR('Shop not found');
        }
        const userInShop = foundShop.users.find(user => user._id.toString() === userId);
        if(!userInShop) {
            throw new FORBIDDEN_ERROR('User is not in shop');
        }
        const foundImage = await imageModel.findById(imageId).lean();
        if(foundImage.addBy.toString() !== userId && userInShop.role > ROLES.SHOP_PRODUCT_MODERATOR) {
            throw new FORBIDDEN_ERROR('You are not authorized to delete this image');
        }
        if(!foundImage) {
            throw new NOT_FOUND_ERROR('Image not found');
        }
        await unlinkFile(path.join(__dirname, '../images/' + foundImage.name));
        await imageModel.findByIdAndDelete(imageId);
        const images = await imageModel.find({ shop: shopId }).select('name').lean();
        return images;
    }
}

module.exports = ImageService;