const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middleware/admin.middleware')
const statisticController = require('../../controllers/AdminController/AdminStatisticController')

router.get('/', adminMiddleware ,statisticController.getCountInfo)
router.get('/sale-by-mouth', adminMiddleware ,statisticController.getSaleByMonth)

module.exports = router