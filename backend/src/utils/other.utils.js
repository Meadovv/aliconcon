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
        let errorMessage = 'Object contains extra fields or missing fields!';

        if (extraFields.length > 0) {
            errorMessage += ` Extra fields: ${extraFields.join(', ')}.`;
        }

        if (missingFields.length > 0) {
            errorMessage += ` Missing fields: ${missingFields.join(', ')}.`;
        }

        throw new BAD_REQUEST_ERROR(errorMessage);
    }

    return pickedObject;
}
}

module.exports = OtherUtils;