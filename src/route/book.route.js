const express = require('express')
const router = express.Router()
const bookController = require('../controllers/BookController')

router.get('/', bookController.getAllBook)
router.get('/new', bookController.getNewBook)
router.get('/best-seller', bookController.getBestSellerBook)
router.get('/search', bookController.searchBook)
router.get('/author/:id', bookController.getBookByAuthorId)
router.get('/publisher/:id', bookController.getBookByPublisherId)
router.get('/year/:year', bookController.getBookByYear)
router.get('/:id', bookController.getBookById)

module.exports = router