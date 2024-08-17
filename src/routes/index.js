const express = require('express');
const  router = express.Router();
const CategoryRouter = require('./categoryRoutes');
const SubCategoryRouter = require('./subCategoryRoutes');
const ItemRouter = require('./ItemRoutes');
const Search = require("../controller/searchController");

router.use("/category", CategoryRouter);
router.use("/sub-category", SubCategoryRouter);
router.use("/item", ItemRouter);
router.get("/search", Search)

module.exports = router;