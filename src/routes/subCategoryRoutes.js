const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createSubCategory,getAllSubCategory, getSubCategory,getSubCategoriesByParentCategory} = require('../controller/subCategoryController')

router.post('/create',createSubCategory)
router.get('/all',getAllSubCategory);
router.get("/", getSubCategory)
router.get("/by-category",getSubCategoriesByParentCategory)

module.exports = router;