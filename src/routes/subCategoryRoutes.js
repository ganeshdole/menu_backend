const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createSubCategory} = require('../controller/subCategoryController')

router.post('/create',createSubCategory)

module.exports = router;