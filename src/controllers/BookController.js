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

	async addBook(req, res) {
		try {
			const book = new Book(req.body)
			await book.save()
			res.status(201).json({ message: 'Create book successful' })
		} catch (err) {
			console.log('Add Book Error', err)
			res.status(401).json({ Error: 'Error' })
		}
	}

	async updateBook(req, res) {
		try {
			const bookData = req.body
			await Book.updateOne(
				{ _id: bookData.id },
				{ $set: { ...bookData } }
			)
			return res.status(200).json({ message: 'Update book successfully' })
		} catch (err) {
			console.log('Update Book: ', err.message)
			return res.status(500).json({ message: 'Server Error' })
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
			const offset = req.query.offset  || 1//
			let {title , sort, page_size, price} = req.query
			let sortFilter = {}
			
			price = price ? price.split(',') : ''
			
			console.log('price',price)

			switch(sort)
			{
				case 'newest':
					sortFilter = {create_at: -1}
					break
				case 'oldest':
					sortFilter = {create_at: 1}
					break
				case 'best-seller':
					sortFilter = {sold: -1}
					break
				case 'cheapest':
					sortFilter = {price: 1}
					break
				case 'most-expensive':
					sortFilter = {price: -1}
					break
				default:
					sortFilter = {}
					break
			}

			const pageSize = Number(page_size) || 15
			
			let books = []
			if(price)
				books = await Book.find({title: new RegExp( title), price:{$gt: parseInt(price[0]), $lt: parseInt(price[1])}}).sort(sortFilter)
				.skip((offset - 1) * pageSize)
				.limit(pageSize)
			
			else
				books = await Book.find({title: new RegExp( title)}).sort(sortFilter)
					.skip((offset - 1) * pageSize)
					.limit(pageSize)
			
			const count = await Book.find({title: new RegExp( title)}).count()
			const totalPage = Math.ceil(count/pageSize)
			res.status(200).json({ book: books, paginate: {offset: req.query.offset, pageSize: pageSize, totalPage: totalPage, total: count} })
		} catch (error) {
			console.log('DB: Get book', error)
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

	async createBook(req, res) {
		try {
			const bookData = req.body
			const book = Book({ ...bookData })
			await book.save()
			res.status(200).json({ message: 'Create new book' })
		} catch (error) {
			res.status(400).json({ Error: 'Error' })
		}
	}

	async updateBook(req, res) {
		try {
			const bookData = req.body
			await Book.findByIdAndUpdate(bookData.id, { ...bookData })
			res.status(200).json({ message: 'Update a book' })
		} catch (error) {
			res.status(400).json({ Error: 'Error' })
		}
	}

	async deleteBook(req, res) {
		try {
			await Book.findByIdAndRemove(req.body.id)
			res.status(200).json({ message: 'Delete a book' })
		} catch (error) {
			res.status(400).json({ Error: 'Error' })
		}
	}
}

module.exports = new BookController()
