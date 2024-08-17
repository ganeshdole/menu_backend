const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createSubCategory,getAllSubCategory, getSubCategory,getSubCategoriesByParentCategory,updateSubCategory} = require('../controller/subCategoryController')

router.post('/create',createSubCategory)
router.get('/all',getAllSubCategory);
router.get("/", getSubCategory)
router.get("/by-category",getSubCategoriesByParentCategory)
router.patch("/update/:id",updateSubCategory)
module.exports = router;