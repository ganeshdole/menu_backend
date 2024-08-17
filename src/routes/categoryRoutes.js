const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {createCategory, getAllCategory, getCategory} = require('../controller/categoryController')

router.post('/create',createCategory)
router.get('/all',getAllCategory);
router.get("/",getCategory)

module.exports = router;