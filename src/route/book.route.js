const express = require('express')
const router = express.Router()
const bookController = require('../controllers/BookController')

router.get('/', bookController.getAllBook)
router.get('/new', bookController.getNewBook)
router.get('/best-seller', bookController.getBestSellerBook)
router.post('/add', bookController.addBook)
router.get('/search', bookController.searchBook)
router.get('/author/:id', bookController.getBookByAuthorId)
router.get('/publisher/:id', bookController.getBookByPublisherId)
router.get('/year/:year', bookController.getBookByYear)
router.get('/:id', bookController.getBookById)
router.patch('/:id', bookController.updateBook)

module.exports = router