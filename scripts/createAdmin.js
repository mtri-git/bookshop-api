// Usage: node scripts/createAdmin.js <email> <password>
// Creates the first admin account directly in the DB
// (POST /admin/auth/create requires an existing admin).
require('dotenv/config')
const mongoose = require('mongoose')
const Admin = require('../src/models/Admin')
const { hashPassword } = require('../src/utils/passwordHandle')

const [email, password] = process.argv.slice(2)
if (!email || !password) {
	console.error('Usage: node scripts/createAdmin.js <email> <password>')
	process.exit(1)
}

;(async () => {
	try {
		await mongoose.connect(process.env.DB_ONLINE || 'mongodb://127.0.0.1:27017/bookshop')
		if (await Admin.findOne({ email })) {
			console.error(`Admin ${email} already exists`)
			process.exitCode = 1
			return
		}
		await Admin.create({ email, password: hashPassword(password) })
		console.log(`Created admin ${email}`)
	} catch (err) {
		console.error('Failed to create admin:', err.message)
		process.exitCode = 1
	} finally {
		await mongoose.disconnect()
	}
})()
