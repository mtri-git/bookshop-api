const mongoose = require('mongoose')
const { defineModel } = require('../configs/requestModel')
const Schema = mongoose.Schema

const User = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		sparse: true
	},
	// sparse: users without a phone must not collide on a null unique key
	phone: {
		type: String,
		unique: true,
		sparse: true,
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
		default: Date.now,
	},
})

User.virtual('fullname').get(function () {
	if (this.last_name === this.first_name && !this.middle_name) return this.first_name
	return [this.last_name, this.middle_name, this.first_name].filter(Boolean).join(' ')
}).set(function(value){
	const data = value.split(' ')
	const last_name = data.at(0)
	const first_name = data.at(-1)
	const middle_name = data.slice(1, -1).join(' ')
	this.set({ first_name, middle_name,  last_name });
})

module.exports = defineModel('User', User)
