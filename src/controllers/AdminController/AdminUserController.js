const User = require('../../models/User')
const { hashPassword } = require('../../utils/passwordHandle')

class AdminUserController{
    async getAllUser(req, res) {
		try {
			const users = await User.find().select('-password')
			return res.status(200).json({ data: users })
		} catch (error) {
			console.log('Update user: ', error.message)
			return res.status(500).json({ message: 'Server error' })
		}
	}
    async getUserById(req, res) {
		try {
			const users = await User.findById(req.params.id).select('-password -__v')
			const {_id, fullname, avatarUrl, email, phone, address, postalCode, birthDate, created_at} = users
			return res.status(200).json({ data: {_id, fullname, avatarUrl, email, phone, address, postalCode, birthDate, created_at} })
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
			const _user = await User.findOne({email: req.body.email})
			if(_user)
				return res.status(400).json({message: "This email has been used"})
			const userData = req.body
			const user = User({ ...userData })
			user.password = hashPassword(user.password)
			await user.save()
			return res.status(200).json({ message: 'Create a new user' })
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