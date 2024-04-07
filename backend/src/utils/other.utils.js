const _ = require('lodash');

const { BAD_REQUEST_ERROR } = require('../core/error.response');

class OtherUtils {
    static getInfoData = ({ fields, object }) => {
        return _.pick(object, fields);
    }

    static getFields = ({ fields, object }) => {
        const pickedObject = _.pick(object, fields);
        if(!_.isEqual(object, pickedObject)) {
            throw new BAD_REQUEST_ERROR('Object contains extra fields');
        }
        return pickedObject;
    }
}

module.exports = OtherUtils;