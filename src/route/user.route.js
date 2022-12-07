const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/get-info', authMiddleware, userController.getInfo)
router.put('/update-info', authMiddleware, userController.updateInfo)

module.exports = router