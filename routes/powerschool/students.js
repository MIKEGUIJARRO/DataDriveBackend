const express = require('express');
const router = new express.Router();

const { getStudents } = require('../../controllers/powerschool/students');
router.route('/').get(getStudents);

module.exports = router;