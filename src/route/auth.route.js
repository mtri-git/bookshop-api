const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/google', authController.loginWithGoogle)
router.post('/token', authController.getAccessToken)
router.post('/change-password', authMiddleware, authController.changePassword)

module.exports = router
