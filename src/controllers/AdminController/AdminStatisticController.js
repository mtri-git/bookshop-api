const User = require('../../models/User')
const Book = require('../../models/Book')
const Order = require('../../models/Order')

class AdminUserController{
    async getCountInfo(req, res) {
		try {
			const user_number = await User.find().count()
			const book_number = await Book.find().count()
			const order_number = await Order.find().count()
            
			return res.status(200).json({ data: {user_number, book_number, order_number} })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

   
}

module.exports = new AdminUserController