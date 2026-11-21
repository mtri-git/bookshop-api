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
			const SHIP_FEE = 12000

			if (!Array.isArray(order_items) || order_items.length === 0 || !payment_type || !address) {
				return res.status(400).json({ message: 'Missing information for order' })
			}
			for (const item of order_items) {
				if (!item?.id || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
					return res.status(400).json({ message: 'Invalid order item' })
				}
			}

			// Prices always come from the DB, never from the client
			const ids = order_items.map((item) => item.id)
			const books = await Book.find({ _id: { $in: ids } }).select('price sale')
			const bookMap = new Map(books.map((b) => [String(b._id), b]))

			let total = 0 // before discount and ship fee
			let itemsValue = 0 // after discount
			const orderItems = []
			for (const item of order_items) {
				const book = bookMap.get(String(item.id))
				if (!book) return res.status(400).json({ message: `Book not found: ${item.id}` })
				const quantity = Number(item.quantity)
				const sale = book.sale || 0
				const lineTotal = book.price * (1 - sale) * quantity
				total += book.price * quantity
				itemsValue += lineTotal
				orderItems.push({ id: item.id, price: book.price, sale, quantity, total: lineTotal })
			}

			const order = new Order({
				order_by: req.user.id,
				order_items: orderItems,
				payment_type,
				address,
				ship_fee: SHIP_FEE,
				total,
				order_total_value: itemsValue + SHIP_FEE,
			})
			await order.save()

			await Book.bulkWrite(
				orderItems.map((item) => ({
					updateOne: { filter: { _id: item.id }, update: { $inc: { sold: item.quantity } } },
				}))
			)

			return res.status(201).json({ message: 'Create new order', data: { id: order._id } })
		} catch (error) {
			console.log('Create order by user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	deleteOrderByUser() {}

	deleteOrderById() {}
}

module.exports = new OrderController()
