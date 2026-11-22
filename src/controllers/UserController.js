const User = require('../models/User')

class UserController {
	async getInfo(req, res) {
		try {
			const user = await User.findById(req.user.id)
			if (!user) return res.status(404).json({ message: 'User not found' })
			res.status(200).json({
				data: {
					fullname: user.fullname,
					email: user.email,
					avatarUrl: user.avatarUrl,
					address: user.address,
					postalCode: user.postalCode,
					phone: user.phone
				},
			})
		} catch (error) {
			console.log(error)
			res.status(500).json({ error: 'Error' })
		}
	}

	async updateInfo(req, res) {
		try {
			// Only allow profile fields; email/password/role must not be changed here
			const allowed = ['first_name', 'middle_name', 'last_name', 'phone', 'address', 'postalCode', 'avatarUrl', 'birthDate']
			const update = {}
			for (const key of allowed) {
				if (req.body[key] !== undefined) update[key] = req.body[key]
			}
			if (typeof req.body.fullname === 'string' && req.body.fullname.trim()) {
				const parts = req.body.fullname.trim().split(/\s+/)
				update.last_name = parts[0]
				update.first_name = parts.length > 1 ? parts[parts.length - 1] : parts[0]
				update.middle_name = parts.slice(1, -1).join(' ')
			}
			// An empty phone must be removed, not stored as "" (phone is unique + sparse)
			const ops = { $set: update }
			if (typeof update.phone === 'string' && !update.phone.trim()) {
				delete update.phone
				ops.$unset = { phone: 1 }
			}
			try {
				await User.findByIdAndUpdate(req.user.id, ops, { runValidators: true })
			} catch (error) {
				if (error?.code === 11000) return res.status(400).json({ message: 'Số điện thoại đã được sử dụng bởi tài khoản khác' })
				throw error
			}
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
	
}

module.exports = new UserController()
