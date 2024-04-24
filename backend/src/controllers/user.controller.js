class UserController {
    static leaveComment = async (req, res) => {
        new CREATED({
            message: 'Comment created successfully',
            metadata: await UserService.leaveComment({
                ...getFields({
                    fields: ['productId', 'comment'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }

    static getComments = async (req, res) => {
        new SUCCESS({
            message: 'Get comment successfully',
            metadata: await UserService.getComment({
                ...getFields({
                    fields: ['productId'],
                    object: req.body
                }),
                ...req.jwt_decode
            })
        }).send(res);
    }
}

module.exports = UserController;