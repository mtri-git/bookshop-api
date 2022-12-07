const User = require('../models/User')
const { hashPassword, verifyHash } = require('../utils/passwordHandle')
const { generateAllToken, verifyToken, generateAccessToken } = require('../utils/jwtHandle')

class AuthorController {
	async login(req, res) {
		try {
			const user = await User.findOne({ email: req.body.email })
			if(!user)
				return res.status(401).json({message: "Account's not existed"})
			const {
				_id,
				password
			} = user
			if (verifyHash(req.body.password, password)) {
				const token = generateAllToken({ id: _id})
				res.status(200).json({ data: token })
				console.log(`${user.fullname} login`)
			} else {
				res.status(401).json({ message: 'Email or password wrong' })
			}
	
		} catch (error) {
			console.log('Error, ', error.message)
			res.status(500).json({message: "Server Error"})
		}
	}

	async register(req, res) {
		try {
			const _user = await User.findOne({email: req.body.email})
			if(_user)
				return res.status(400).json({message: "This email has been used"})
			const user = new User(req.body)
			user.password = hashPassword(user.password)
			await user.save()
			res.status(200).json({ message: 'Register successful' })
			console.log('DB: An account has been registered')
		} catch (err) {
			console.log('Register', err)
			res.status(500).json({ error: "There's an error" })
		}
	}

	getAccessToken(req, res) {
		const refreshToken = req.body.refreshToken
		if (refreshToken == null) 
			return res.sendStatus(401)
		try {
			// verify if this is a refresh token
			const user = verifyToken('refresh', refreshToken)
			const {id} = user
			if(id)
			{
				const accessToken = generateAccessToken({id: id})
				return res.status(200).json(accessToken)
			}
			return res.status(400).json({message: "Error"})

		} catch (err) {
			console.error('Reset token',err)
			res.status(500).json({error:"Error"})
		}
	}

	changePassword(req, res) {
		res.status(200).json({ message: 'Password have changed' })
		console.log('Change pass')
	}
}

module.exports = new AuthorController()
