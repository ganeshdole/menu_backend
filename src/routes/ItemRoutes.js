const express = require('express')
const {createItem} = require('../controller/itemController')
const router = express.Router()

router.post("/create", createItem);

module.exports = router;