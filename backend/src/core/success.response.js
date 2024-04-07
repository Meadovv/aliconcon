'use strict'

const HTTP_CODE = require('../constants/HTTP_CODE');

class SuccessResponse {
    constructor({ message, status = HTTP_CODE.STATUS_CODE.OK, reasonStatusCode = HTTP_CODE.REASON_PHRASE.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = status;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        res.set(headers);
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, status = HTTP_CODE.STATUS_CODE.CREATED, reasonStatusCode = HTTP_CODE.REASON_PHRASE.CREATED, metadata }) {
        super({ message, status, reasonStatusCode, metadata });
    }
}

class SUCCESS extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

module.exports = {
    OK,
    CREATED,
    SUCCESS
}