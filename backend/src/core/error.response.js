'use strict'

const HTTP_CODE = require('../constants/HTTP_CODE');

class ErrorResponse extends Error {
    
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BAD_REQUEST_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.BAD_REQUEST, status = HTTP_CODE.STATUS_CODE.BAD_REQUEST) {
        super(message, status);
    }
}

class UNAUTHORIZED_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.UNAUTHORIZED, status = HTTP_CODE.STATUS_CODE.UNAUTHORIZED) {
        super(message, status);
    }
}

class UNAUTHENTICATED_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.UNAUTHENTICATED, status = HTTP_CODE.STATUS_CODE.UNAUTHENTICATED) {
        super(message, status);
    }
}

class NOT_FOUND_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.NOT_FOUND, status = HTTP_CODE.STATUS_CODE.NOT_FOUND) {
        super(message, status);
    }
}

class TOKEN_EXPIRED_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.TOKEN_EXPIRED, status = HTTP_CODE.STATUS_CODE.UNAUTHORIZED) {
        super(message, status);
    }

}

class FORBIDDEN_ERROR extends ErrorResponse {
    constructor(message = HTTP_CODE.REASON_PHRASE.FORBIDDEN, status = HTTP_CODE.STATUS_CODE.FORBIDDEN) {
        super(message, status);
    }
}

module.exports = {
    UNAUTHENTICATED_ERROR,
    UNAUTHORIZED_ERROR,
    BAD_REQUEST_ERROR,
    NOT_FOUND_ERROR,
    TOKEN_EXPIRED_ERROR,
    FORBIDDEN_ERROR
}