const express = require('express');
const  router = express.Router()
const CategoryRouter = require('./categoryRoutes')
const SubCategoryRouter = require('./subCategoryRoutes')
const ItemRouter = require('./ItemRoutes')

router.use("/category", CategoryRouter);
router.use("/sub-category", SubCategoryRouter);
router.use("/item", ItemRouter);

module.exports = router;