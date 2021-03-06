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
        // Used to get the drave text metadata
        'https://www.googleapis.com/auth/drive.metadata',
        // Used for getting profile pic
        'https://www.googleapis.com/auth/contacts',
        // 
        'https://www.googleapis.com/auth/drive.readonly',
        // Google docs
        'https://www.googleapis.com/auth/documents',
    ],
    accessType: 'offline',
});

module.exports.getGoogleCallback = passport.authenticate('google', {
    successRedirect: `${CLIENT_URL}/home`,
    failureRedirect: '/login/failed',
    session: true
});