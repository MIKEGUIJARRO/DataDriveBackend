const express = require('express');

const { getFiles, getFilePlaceHolders } = require('../controllers/drive');

const router = new express.Router();

router.route('/').get(getFiles);

router.route('/file').get(getFilePlaceHolders);


module.exports = router;