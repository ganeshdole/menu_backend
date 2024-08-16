const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createCategory} = require('../controller/categoryController')

router.post('/create',createCategory)

module.exports = router;