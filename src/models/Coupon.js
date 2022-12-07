const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Coupon = new Schema({
	code: {
		type: String,
	},
	applyTo: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Book',
		},
	],
    sale: Number,
    condition: {
        min_order_value: Number,
        max_discount: Number
    },
	max_used: {
        type: Number,
        default:0
    },
    current_used: {
        type: Number,
        default: 0
    },
    expire_in: Date,
    updated_at: Date,
	created_at: {
		type: Date,
		default: Date.now(),
	},
})

User.virtual('fullname')
	.get(function () {
		return `${this.last_name} ${this.middle_name} ${this.first_name}`
	})
	.set(function (value) {
		const data = value.split(' ')
		const last_name = data.at(0)
		const first_name = data.at(-1)
		const middle_name = data.slice(1, -1).join(' ')
		this.set({ first_name, middle_name, last_name })
	})

module.exports = mongoose.model('User', User)
