const express = require('express');
const passport = require('passport')

const authCheck = require('../middlewares/auth');

const router = new express.Router();

const CLIENT_URL = 'http://localhost:3000';

router.get('/login/success', authCheck, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Success',
        user: req.user,
        // cookies: req.cookies
    });
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Failure redirect',
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_URL);
});

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file'
    ],
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: `${CLIENT_URL}/home`,
    failureRedirect: '/login/failed'
}));

module.exports = router;