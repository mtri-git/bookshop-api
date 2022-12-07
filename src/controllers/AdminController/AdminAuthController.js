const Admin = require('../../models/Admin')
const { generateAllToken } = require('../../utils/adminJwtHandle')
const { hashPassword, verifyHash } = require('../../utils/passwordHandle')

class AdminUserController{
	async login(req, res) {
		try {
			const admin = await Admin.findOne({ email: req.body.email }).lean()
			if(!admin)
				return res.status(401).json({message: "Account's not existed"})
			const {
				_id,
				password
			} = admin
			if (verifyHash(req.body.password, password)) {
				const token = generateAllToken({ id: _id})
				delete admin.password
				res.status(200).json({ data: token, user: admin })
			} else {
				res.status(401).json({ message: 'Email or password wrong' })
			}
	
		} catch (error) {
			console.log('Error, ', error.message)
			res.status(500).json({message: "Server Error"})
		}
	}

	async createAdmin(req, res) {
		try {
			const admin = new Admin(req.body)
			admin.password = hashPassword(admin.password)
			await admin.save()
			res.status(200).json({ message: 'Create new admin' })
		} catch (error) {
			console.log('Login admin: ', error)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async getInfo(req, res) {
		try {
			const admin = await Admin.findById(req.user.id).select('_id email avatarUrl')
			if(admin)
				return res.status(200).json({ data: admin })
			else
				return res.status(404).json({message: "Not found"})
		} catch (error) {
			console.log('Login admin: ', error)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	
}

module.exports = new AdminUserController