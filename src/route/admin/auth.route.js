const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middleware/admin.middleware')
const authController = require('../../controllers/AdminController/AdminAuthController')

router.post('/login', authController.login)
router.post('/create', authController.createAdmin )
router.get('/get-info', adminMiddleware, authController.getInfo)
// router.get('/', userController.getAllUser)
// router.get('/', userController.getAllUser)


module.exports = router