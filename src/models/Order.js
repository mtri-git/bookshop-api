const mongoose = require('mongoose')

const Order = new mongoose.Schema({
	order_items: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book',
			},
			price: Number,
			sale: Number,
			total: Number,
			quantity: Number,
		},
	],
	order_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	status: {type: String, default: 'Chờ xác nhận'},
	payment_type: {type: String, default: 'cod'}, // momo, bank, cod
	is_paid: {type: Boolean, default: false},
	address: String,
	create_at: {
		type: Date,
		default: Date.now(),
	},
	ship_fee: Number,
	total: Number, // not include coupon and ship fee
	order_total_value: Number,
})

module.exports = mongoose.model('Order', Order)
