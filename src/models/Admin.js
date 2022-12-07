const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema({

	email: {
		type: String,
		required: true,
		unique: true,
		sparse: true
	},
	password: {
		type: String,
		required: true,
	},
	avatarUrl: String,
    updated_at: Date,
	created_at: {
		type: Date,
		default: Date.now(),
	},
})


module.exports = mongoose.model('Admin', Admin)
