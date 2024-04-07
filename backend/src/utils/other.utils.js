const _ = require('lodash');

const { BAD_REQUEST_ERROR } = require('../core/error.response');

class OtherUtils {
    static getInfoData = ({ fields, object }) => {
        return _.pick(object, fields);
    }

    static getFields = ({ fields, object }) => {
        const pickedObject = _.pick(object, fields);
        const extraFields = _.difference(_.keys(object), fields);
        const missingFields = _.difference(fields, _.keys(object));

        if (extraFields.length > 0 || missingFields.length > 0) {
            throw new BAD_REQUEST_ERROR('Object contains extra fields or missing fields!');
        }

        return pickedObject;
    }
}

module.exports = OtherUtils;