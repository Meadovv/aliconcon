class ErrorMiddleware {
    static asyncHandler = (fn) => {
        return (req, res, next) => fn(req, res, next).catch(next);
    }
}

module.exports = ErrorMiddleware;