const shopModel = require('../models/shop.model');

class ShopService {
    static findByEmail = async (email) => {
        return await shopModel.findOne({ email }).lean();
    }

    static findById = async (id) => {
        return await shopModel.findById({ _id: id }).lean();
    }

    static createShop = async ({ name, email, user, phone = null, address = null }) => {
        return await shopModel.create({
            name,
            email,
            phone,
            address,
            users: [
                user
            ]
        });
    }
}

module.exports = ShopService;