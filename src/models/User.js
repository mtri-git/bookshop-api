const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
	phone: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		sparse: true
	},
	phone: {
		type: String,
		unique: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	middle_name: {
		type: String,
		maxLength: 50,
	},
	last_name: {
		type: String,
		maxLength: 50,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	avatarUrl: String,
	birthDate: Date,
	address: String,
	postalCode: String,
	created_at: {
		type: Date,
		default: Date.now(),
	},
})

User.virtual('fullname').get(function () {
	return `${this.last_name} ${this.middle_name} ${this.first_name}`
}).set(function(value){
	const data = value.split(' ')
	const last_name = data.at(0)
	const first_name = data.at(-1)
	const middle_name = data.slice(1, -1).join(' ')
	this.set({ first_name, middle_name,  last_name });
})

module.exports = mongoose.model('User', User)
