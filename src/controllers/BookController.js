const mongoose = require('mongoose')
const Book = require('../models/Book')

// Public catalogue responses can be cached by browsers/CDNs for a short while
const cachePublic = (res, seconds = 60) =>
	res.set('Cache-Control', `public, max-age=${seconds}, s-maxage=${seconds * 5}, stale-while-revalidate=600`)

// Escape user input so it is matched literally (prevents ReDoS / invalid regex)
const escapeRegex = (value) => value.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

class BookController {
	async getBookById(req, res) {
		try {
			if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Book not found' })
			const book = await Book.findById(req.params.id)
			if (!book) return res.status(404).json({ message: 'Book not found' })
			cachePublic(res)
			res.status(200).json({ book: book })
		} catch (err) {
			console.log('Controller: Get book by id', err)
			res.status(400).json()
		}
	}

	async getAllBook(req, res) {
		try {
			const offset = Math.max(Number(req.query.offset) || 1, 1)
			const pageSize = 15
			const books = await Book.find()
				.skip((offset - 1) * pageSize)
				.limit(pageSize)
			res.status(200).json({ data: books })
		} catch (error) {
			console.log('DB: Get book', error)
			res.status(400).json({ Error: 'Error' })
		}
	}

	async searchBook(req, res) {
		try {
			const offset = Math.max(Number(req.query.offset) || 1, 1)
			const pageSize = Math.min(Math.max(Number(req.query.page_size) || 15, 1), 100)
			const { title, sort, price, category, author } = req.query

			const sortOptions = {
				newest: { create_at: -1 },
				oldest: { create_at: 1 },
				'best-seller': { sold: -1 },
				cheapest: { price: 1 },
				'most-expensive': { price: -1 },
			}
			const sortFilter = sortOptions[sort] || {}

			const filter = {}
			if (typeof title === 'string' && title.trim()) {
				filter.title = new RegExp(escapeRegex(title), 'i')
			}
			// category is an array of names; match an element case-insensitively
			if (typeof category === 'string' && category.trim()) {
				filter.category = new RegExp(`^${escapeRegex(category)}`, 'i')
			}
			if (typeof author === 'string' && author.trim()) {
				filter.author = new RegExp(escapeRegex(author), 'i')
			}
			if (typeof price === 'string' && price.includes(',')) {
				const [min, max] = price.split(',').map(Number)
				filter.price = {}
				if (Number.isFinite(min)) filter.price.$gt = min
				if (Number.isFinite(max)) filter.price.$lt = max
			}

			const [books, count] = await Promise.all([
				Book.find(filter)
					.sort(sortFilter)
					.skip((offset - 1) * pageSize)
					.limit(pageSize),
				Book.countDocuments(filter),
			])
			const totalPage = Math.ceil(count / pageSize)
			cachePublic(res, 30)
			res.status(200).json({ book: books, paginate: { offset, pageSize, totalPage, total: count } })
		} catch (error) {
			console.log('DB: Search book', error)
			res.status(400).json({ Error: 'Error' })
		}
	}

	async getNewBook(req, res) {
		try {
			const pageSize = 5
			const books = await Book.find()
				.sort({create_at: -1})
				.limit(pageSize)
			cachePublic(res)
			res.status(200).json({ book: books })
		} catch (error) {
			console.log('DB: Get book', error)
			res.status(400).json({ Error: 'Error' })
		}
	}

	async getBestSellerBook(req, res) {
		try {
			const pageSize = 5
			const books = await Book.find()
				.sort({sold: -1})
				.limit(pageSize)
			cachePublic(res)
			res.status(200).json({ book: books })
		} catch (error) {
			console.log('DB: Get book', error)
			res.status(400).json({ Error: 'Error' })
		}
	}

	

	getBookByAuthorId(req, res) {}

	getBookByPublisherId(req, res) {}

	getBookByYear(req, res) {}

}

module.exports = new BookController()
