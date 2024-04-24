const adminModel = require('../models/admin.model');

class AdminService {
    static findById = async (id) => {
        return await adminModel.findById(id).lean();
    }

    static findByEmail = async (email) => {
        return await adminModel.findOne({ email: email }).lean();
    }
}

module.exports = AdminService;