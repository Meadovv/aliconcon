const {
    CREATED, SUCCESS
} = require('../core/success.response');
const { getFields } = require('../utils/other.utils');
const ShopService = require('../services/shop.service');


class ShopController {
    static addUser = async (req, res) => {
        new CREATED({
            message: 'User added successfully!',
            metadata: await ShopService.addUser({
                ...getFields({
                    fields: ['target_email', 'target_password', 'target_role'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = ShopController;