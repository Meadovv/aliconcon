const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')

const ImageService = require("../services/image.service");

class ImageController {
    static upload = (req, res) => {
        return new CREATED({
            message: 'Upload Image Successfully!',
            metadata: ImageService.upload({
                ...req.file,
                ...req.jwt_decoded
            })
        }).send(res);
    }

    static delete = (req, res) => {

    }
}

module.exports = ImageController;