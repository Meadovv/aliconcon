const {
    CREATED, SUCCESS
} = require('../core/success.response')

const {
    getFields
} = require('../utils/other.utils')

const ImageService = require("../services/image.service");

class ImageController {
    static upload = async (req, res) => {
        return new CREATED({
            message: 'Upload Image Successfully!',
            metadata: await ImageService.upload({
                file: req.file,
                ...req.jwt_decode
            })
        }).send(res);
    }

    static delete = async (req, res) => {
        return new SUCCESS({
            message: 'Delete Image Successfully!',
            metadata: await ImageService.delete({
                ...getFields({
                    fields: ['imageId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static get = async (req, res) => {
        return new SUCCESS({
            message: 'Get Image Successfully!',
            metadata: await ImageService.get({
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = ImageController;