const mongoose = require('mongoose')
const Order = require('../models/Order')
const Book = require('../models/Book')
const { priceOrder } = require('../utils/pricing')

const PAYMENT_TYPES = ['Cash', 'Momo', 'Bank']
const MAX_QUANTITY = 99
class OrderController {
	getOrderById() {}

	async getOrderByUser(req, res) {
		try {
			const user = req.user
			let orders = await Order.find({ order_by: user.id })
				.sort({ create_at: -1 })
				.select('-__v')
				.populate({
					path: 'order_items.id',
					select: 'id title imageUrl',
				})
				.lean()
			// Legacy orders may have no order_items; a deleted book populates to null
			orders = orders.map(order => {
				order.order_items = (order.order_items || []).map(({ id, ...order_item }) => ({ ...order_item, info: id || null }))
				return order
			})
			res.status(200).json({ data: orders })
		} catch (error) {
			console.log('get order: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async createOrderByUser(req, res) {
		try {
			const { order_items, payment_type, address, phone, receiver, voucher } = req.body

			if (!Array.isArray(order_items) || order_items.length === 0 || order_items.length > 50) {
				return res.status(400).json({ message: 'Giỏ hàng trống hoặc không hợp lệ' })
			}
			if (!PAYMENT_TYPES.includes(payment_type)) {
				return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' })
			}
			if (typeof address !== 'string' || address.trim().length < 5) {
				return res.status(400).json({ message: 'Vui lòng nhập địa chỉ giao hàng' })
			}
			if (typeof phone !== 'string' || !/^[0-9+\s.-]{8,15}$/.test(phone.trim())) {
				return res.status(400).json({ message: 'Số điện thoại không hợp lệ' })
			}
			const seen = new Set()
			for (const item of order_items) {
				const quantity = Number(item?.quantity)
				if (!item?.id || !mongoose.isValidObjectId(item.id) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
					return res.status(400).json({ message: 'Sản phẩm trong đơn không hợp lệ' })
				}
				if (seen.has(String(item.id))) return res.status(400).json({ message: 'Sản phẩm bị trùng trong đơn' })
				seen.add(String(item.id))
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
				if (!book) return res.status(400).json({ message: 'Một số sách không còn tồn tại, vui lòng cập nhật giỏ hàng', missing: item.id })
				const quantity = Number(item.quantity)
				const sale = book.sale || 0
				// Round the unit price (VND has no decimals) exactly like the storefront does
				const lineTotal = Math.round(book.price * (1 - sale)) * quantity
				total += book.price * quantity
				itemsValue += lineTotal
				orderItems.push({ id: item.id, price: book.price, sale, quantity, total: lineTotal })
			}

			const pricing = priceOrder(itemsValue, voucher)
			const order = new Order({
				order_by: req.user.id,
				order_items: orderItems,
				payment_type,
				address: address.trim(),
				phone: phone.trim(),
				receiver: typeof receiver === 'string' ? receiver.trim().slice(0, 100) : undefined,
				voucher: pricing.voucher,
				voucher_discount: pricing.voucherDiscount,
				ship_fee: pricing.shipFee,
				total,
				order_total_value: pricing.total,
			})
			await order.save()

			await Book.bulkWrite(
				orderItems.map((item) => ({
					updateOne: { filter: { _id: item.id }, update: { $inc: { sold: item.quantity } } },
				}))
			)

			return res.status(201).json({ message: 'Create new order', data: { id: order._id, total: pricing.total } })
		} catch (error) {
			console.log('Create order by user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	deleteOrderByUser() {}

	deleteOrderById() {}
}

module.exports = new OrderController()
