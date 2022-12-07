const Book = require('../../models/Book')

class AdminBookController {
	async getAllBook(req, res) {
		try {
			const offset = req.query.offset || 1 //
			const pageSize = req.query.pageSize || 15
			const books = await Book.find()
				.sort({ create_at: -1 })
				.skip((offset - 1) * pageSize)
				.limit(pageSize)
			const count = await Book.find().count()
			const totalPage = Math.ceil(count / pageSize)
			const paginate = { offset, pageSize, totalPage }
			res.status(200).json({ data: books, paginate })
		} catch (error) {
			console.log('DB: Get book', error)
			res.status(500).json({ Error: 'Error' })
		}
	}

	async getBookById(req, res) {
		try {
			const id = req.params.id
			const book = await Book.findById(id)
			res.status(200).json({ data: book })
		} catch (error) {
			console.log('DB: Get book', error)
			res.status(500).json({ Error: 'Error' })
		}
	}

	async updateBook(req, res) {
		try {
			const {
				id,
				title,
				imageUrl,
				category,
				price,
				sale,
				active,
				author,
				publisher,
				publication_year,
				iventory,
				description,
			} = req.body

			await Book.findByIdAndUpdate(id, {
				id,
				title,
				imageUrl,
				category,
				price,
				sale,
				active,
				author,
				publisher,
				publication_year,
				iventory,
				description,
			})
			return res.status(200).json({ message: 'Update Book completed' })
		} catch (error) {
			console.log('Update Book: ', error)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async createBook(req, res) {
		try {
			const BookData = req.body
			const book = new Book({ ...BookData })
			await book.save()
			return res.status(200).json({ message: 'Create a new book' })
		} catch (error) {
			console.log('Create Book: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async deleteBook(req, res) {
		try {
			await Book.findByIdAndDelete(req.params.id)
			return res.status(200).json({ message: 'Delete Book completed' })
		} catch (error) {
			console.log('Update Book: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
}

module.exports = new AdminBookController()
