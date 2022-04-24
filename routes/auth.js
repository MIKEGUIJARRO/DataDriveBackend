const express = require('express');
const passport = require('passport');
const { getLoginSuccess, getLoginFailed, getLogout, getGoogle, getGoogleCallback } = require('../controllers/auth');

const authCheck = require('../middlewares/auth');

const router = new express.Router();


router.route('/login/success').get(authCheck, getLoginSuccess);

router.route('login/failed').get(getLoginFailed);

router.route('/logout').get(getLogout);

router.route('/google').get(getGoogle);

router.route('/google/callback').get(getGoogleCallback);

module.exports = router;