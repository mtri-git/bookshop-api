const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../middleware/admin.middleware')
const bookController = require('../../controllers/AdminController/AdminBookController')

router.get('/', adminMiddleware,adminMiddleware ,bookController.getAllBook)
router.post('/create', adminMiddleware ,bookController.createBook )
router.put('/update', adminMiddleware ,bookController.updateBook )
router.get('/:id',  adminMiddleware,adminMiddleware,bookController.getBookById )
router.delete('/:id', adminMiddleware,bookController.deleteBook )
// router.get('/', userController.getAllUser)
// router.get('/', userController.getAllUser)


module.exports = router