const User = require('../models/User')

class UserController {
	async getInfo(req, res) {
		try {
			const user = await User.findById(req.user.id)
			res.status(200).json({
				data: {
					fullname: `${user?.last_name} ${user?.middle_name} ${user?.first_name}`,
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
			const userData = req.body
			await User.findByIdAndUpdate(req.user.id, { ...userData })
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
	
}

module.exports = new UserController()
