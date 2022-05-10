const ErrorResponse = require("../util/errorResponse");

authCheck = (req, res, next) => {
    console.log(req);
    if (!req.user) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    } else {
        next();
    }
}

module.exports = authCheck;