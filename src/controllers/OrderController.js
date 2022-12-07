const Order = require('../models/Order')
const Book = require('../models/Book')
class OrderController {
	getOrderById() {}

	async getOrderByUser(req, res) {
		try {
			const user = req.user
			let orders = await Order.find({ order_by: user.id })
				.select('-__v')
				.populate({
					path: 'order_items.id',
					select: 'id title imageUrl',
				})
				.lean()
			orders = orders.map(order => {
				order.order_items.map(order_item => {
					order_item.info = order_item.id
					delete order_item['id']
					console.log(order_item)
					return order_item
				})
				return order
			})
			// console.log(orders)
			res.status(200).json({ data: orders })
		} catch (error) {
			console.log('get order: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async createOrderByUser(req, res) {
		try {
			const { order_items, payment_type, address } = req.body
			let total = 0
			let order_total_value = 0
			const ship_fee = 12000
			if (order_items && payment_type && address) {
				const orderItems = await Promise.all(
					order_items.map( async(item) => 
						{
							const book = await Book.findOne({_id: item.id}).select('title imagUrl price sale')
							const {price, sale} = book
							total = price * item.quantity
							order_total_value = price * (1-sale) * item.quantity + ship_fee
							return {id: item.id, price, sale, quantity: item.quantity, ship_fee}
						}
						)
				)
				const orderData = { payment_type, address, total, order_total_value}

				const order = new Order({ order_by: req.user.id, order_items: orderItems, ...orderData })
				await order.save()
				return res.status(201).json({ message: 'Create new order' })
			} else throw new Error('Missing information for order')
		} catch (error) {
			console.log('Create order by user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	deleteOrderByUser() {}

	deleteOrderById() {}
}

module.exports = new OrderController()
