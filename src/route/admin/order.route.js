const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middleware/admin.middleware')
const orderController = require('../../controllers/AdminController/AdminOrderController')

router.get('/', adminMiddleware ,orderController.getAllOrder)
router.get('/:id',adminMiddleware, orderController.getOrderById)
router.post('/create', orderController.createOrder )
router.delete('/delete', adminMiddleware, orderController.deleteOrder)
router.put('/update', adminMiddleware, orderController.updateOrder)
// router.get('/', userController.getAllUser)
// router.get('/', userController.getAllUser)


module.exports = router