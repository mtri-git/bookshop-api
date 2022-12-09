const User = require('../../models/User')
const Book = require('../../models/Book')
const Order = require('../../models/Order')

class AdminUserController{
    async getCountInfo(req, res) {
		try {
			const user_number = await User.find().count()
			const book_number = await Book.find().count()
			const order_number = await Order.find().count()
            const total_sale = await Order.aggregate([{
				$group: {
					_id: '',
					totalAmount: { $sum: '$order_total_value' }
				}
			 }])

			return res.status(200).json({ data: {user_number, book_number, order_number, total_sale: total_sale[0].totalAmount} })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async getSaleByMonth(req, res){
		try {
			// ref: https://stackoverflow.com/questions/11973304/mongodb-mongoose-querying-at-a-specific-date
			const year = req.query.year || 2022
			const minDate = new Date(`${year}-1-01`)
			const maxDate = new Date(`${year+1}-1-01`)
			const sale = await Order.aggregate([{$match: {create_at: {$gte: minDate, $lt: maxDate}}}, {$group: { _id: {month: {$month: "$create_at"}, year:{$year: "$create_at"}}, total: {$sum: "$order_total_value"}}}]).sort({_id: 1})

			return res.status(200).json({ data: sale })
			
		} catch (error) {
			console.log(error.message)
			return res.status(500).json({ message: 'Server error' })
			
		}

	}

   
}

module.exports = new AdminUserController