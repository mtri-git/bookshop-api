const Order = require('../../models/Order')

class AdminOrderController{
    async getAllOrder(req, res) {
		try {
			const offset = req.query.offset || 1//
			const pageSize = req.query.pageSize || 15
			let orders = await Order.find()
				.select('-__v')
				.populate({
					path: 'order_items.id',
					select: 'id title imageUrl',
				})
				.populate({
					path:'order_by',
					select: '_id first_name middle_name last_name avatarUrl'
				})
				.skip((offset - 1) * pageSize)
				.limit(pageSize)
				.lean()
			const count = await Order.find().count()
			const totalPage = Math.ceil(count/pageSize) 
			const paginate = {offset, pageSize, totalPage}
			orders = orders.map(order => {
				order.order_items.map(order_item => {
					order_item.info = order_item.id
					delete order_item['id']
					return order_item
				})
				return order
			})
			res.status(200).json({ data: orders, paginate })
		} catch (error) {
			console.log('get order: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

    async getOrderById(req, res) {
		try {
			let order = await Order.findById(req.params.id)
				.select('-__v')
				.populate({
					path: 'order_items.id',
					select: 'id title imageUrl',
				})
				.populate({
					path:'order_by',
					select: 'first_name middle_name last_name avatarUrl'
				})
				.lean()

				order.order_items = order.order_items.map(order_item => {
					order_item.info = order_item.id
					delete order_item['id']
					return order_item
				})
			res.status(200).json({ data: order})
		} catch (error) {
			console.log('get order: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

    async updateOrder(req, res) {
		try {
			const {id, status, payment_type, is_paid, address} = req.body
			await Order.findByIdAndUpdate(id, { status, payment_type, is_paid, address })
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async createOrder(req, res) {
		try {
			const orderData = req.body
			const order = new Order({ ...orderData })
			await order.save()
			return res.status(200).json({ message: 'Create a new used' })
		} catch (error) {
			console.log('Create User: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async deleteOrder(req, res) {
		try {
			await User.findByIdAndDelete(req.body.id)
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
}

module.exports = new AdminOrderController