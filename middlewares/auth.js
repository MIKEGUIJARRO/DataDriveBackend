authCheck = (req, res, next) => {
    if (!req.user) {
        return next(new Error('Not authorized to access this route', 401));
    } else {
        next();
    }
}

module.exports = authCheck;