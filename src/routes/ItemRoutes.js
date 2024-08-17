const express = require('express')
const {createItem, getAllItem,getItem,getItemByParentCategory, getItemByParentSubCategory, updateItem} = require('../controller/itemController')
const router = express.Router()

router.post("/create", createItem);
router.get("/", getItem)
router.get('/all',getAllItem);
router.get("/by-category",getItemByParentCategory)
router.get("/by-sub-category", getItemByParentSubCategory)
router.patch("/update", updateItem)


module.exports = router;