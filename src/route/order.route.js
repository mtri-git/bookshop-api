const express = require('express')
const router = express.Router()
const orderController = require('../controllers/OrderController')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/', authMiddleware ,orderController.getOrderByUser)
router.post('/create', authMiddleware ,orderController.createOrderByUser)
// router.post('/create', authMiddleware ,orderController.createOrderByUser)

// router.delete('/delete', authMiddleware ,orderController.deleteOrderByUser)

module.exports = router