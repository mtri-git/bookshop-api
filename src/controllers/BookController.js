const Book = require('../models/Book')

class BookController {
	async getBookById(req, res) {
		try {
			const book = await Book.findById(req.params.id)
			res.status(200).json({ book: book })
		} catch (err) {
			console.log('Controller: Get book by id', err)
			res.status(400).json()
		}
	}

	async getAllBook(req, res) {
		try {
			const offset = req.query.offset //
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
			const { title, sort, price } = req.query

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
				// Escape user input so it is matched literally (prevents ReDoS / invalid regex)
				const escaped = title.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
				filter.title = new RegExp(escaped, 'i')
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
