const express = require('express');
const  router = express.Router()
const CategoryRouter = require('./categoryRoutes')
const SubCategoryRouter = require('./subCategoryRoutes')

router.use("/category", CategoryRouter);
router.use("/sub-category", SubCategoryRouter)

module.exports = router;