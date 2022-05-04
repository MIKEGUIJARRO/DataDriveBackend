const express = require('express');

const { getFiles, getKeywordTemplates, getPDFFile } = require('../controllers/drive');

const router = new express.Router();

router.route('/').get(getFiles);

//router.route('/file/keywordstemplate').get(getKeywordTemplates);

router.route('/file/:id').get(getKeywordTemplates).post(getPDFFile);


module.exports = router;