const passport = require('passport');

const CLIENT_URL = process.env.CLIENT_URL;

module.exports.getLoginSuccess = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Success',
        user: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            profilePicture: req.user.profilePicture,
        },
        // cookies: req.cookies
    });
};

module.exports.getLoginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Failure redirect',
    });
};

module.exports.getLogout = (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
};

module.exports.getGoogle = passport.authenticate('google', {
    scope: [
        'profile',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/admin.directory.user',
        // Used for getting profile pic
        'https://www.googleapis.com/auth/contacts'
    ],
    accessType: 'offline',
});

module.exports.getGoogleCallback = passport.authenticate('google', {
    successRedirect: `${CLIENT_URL}/home`,
    failureRedirect: '/login/failed'
});