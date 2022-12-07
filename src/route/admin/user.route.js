const express = require('express')
const router = express.Router()
const userController = require('../../controllers/AdminController/AdminUserController')
const adminMiddleware = require('../../middleware/admin.middleware')

router.get('/', adminMiddleware, userController.getAllUser)
router.post('/create', adminMiddleware ,userController.createUser)
router.put('/update', adminMiddleware ,userController.updateUser)
router.get('/:id', adminMiddleware, userController.getUserById)
router.delete('/:id', adminMiddleware ,userController.deleteUser)
// router.get('/', userController.getAllUser)
// router.get('/', userController.getAllUser)


module.exports = router