const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middleware/admin.middleware')
const statisticController = require('../../controllers/AdminController/AdminStatisticController')

router.get('/', adminMiddleware ,statisticController.getCountInfo)

module.exports = router