const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createCategory, getAllCategory, getCategory,updateCategory} = require('../controller/categoryController')

router.post('/create',createCategory)
router.get('/all',getAllCategory);
router.get("/",getCategory)
router.patch("/update/:id",updateCategory)
module.exports = router;