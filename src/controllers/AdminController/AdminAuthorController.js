const User = require('../../models/User')

class AdminUserController{
    async getAllUser(req, res) {
		try {
			const users = await User.find()
			return res.status(200).json({ data: users })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

    async updateUser(req, res) {
		try {
			const userData = req.body
			await User.findByIdAndUpdate(userData.id, { ...userData })
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async createUser(req, res) {
		try {
			const userData = req.body
			const user = User({ userData })
			await user.save()
			return res.status(200).json({ message: 'Create a new used' })
		} catch (error) {
			console.log('Create User: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}

	async deleteUser(req, res) {
		try {
			await User.findByIdAndDelete(req.body.id)
			return res.status(200).json({ message: 'Update user completed' })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
}

module.exports = new AdminUserController