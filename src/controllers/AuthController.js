const crypto = require('node:crypto')
const User = require('../models/User')
const { hashPassword, verifyHash } = require('../utils/passwordHandle')
const { generateAllToken, verifyToken, generateAccessToken } = require('../utils/jwtHandle')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

class AuthController {
	async login(req, res) {
		try {
			const { email, password } = req.body
			if (typeof email !== 'string' || typeof password !== 'string') {
				return res.status(400).json({ message: 'Email and password are required' })
			}
			// Older accounts may have been stored with their original casing
			const user = await User.findOne({ email: { $in: [email.trim().toLowerCase(), email.trim()] } })
			if (!user || !verifyHash(password, user.password)) {
				return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' })
			}
			res.status(200).json({ data: generateAllToken({ id: user._id }) })
		} catch (error) {
			console.log('Login error: ', error.message)
			res.status(500).json({ message: 'Server Error' })
		}
	}

	async register(req, res) {
		try {
			const { email, password, fullname } = req.body
			if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
				return res.status(400).json({ message: 'Email không hợp lệ' })
			}
			if (typeof password !== 'string' || password.length < 6) {
				return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
			}
			if (typeof fullname !== 'string' || !fullname.trim()) {
				return res.status(400).json({ message: 'Vui lòng nhập họ tên' })
			}
			const normalizedEmail = email.trim().toLowerCase()
			if (await User.findOne({ email: { $in: [normalizedEmail, email.trim()] } })) {
				return res.status(400).json({ message: 'Email này đã được sử dụng' })
			}
			// Only whitelisted fields: never pass req.body straight into the model
			const user = new User({ email: normalizedEmail, password: hashPassword(password) })
			user.fullname = fullname.trim()
			await user.save()
			res.status(201).json({ message: 'Register successful' })
		} catch (err) {
			console.log('Register', err.message)
			res.status(500).json({ message: "There's an error" })
		}
	}

	// Sign in / sign up with a Google ID token (from Google Identity Services).
	// The token is verified by Google; we then issue our own JWTs.
	async loginWithGoogle(req, res) {
		try {
			const { credential } = req.body
			const clientId = process.env.GOOGLE_CLIENT_ID
			if (!clientId) return res.status(501).json({ message: 'Google login is not configured' })
			if (typeof credential !== 'string' || !credential) {
				return res.status(400).json({ message: 'Missing Google credential' })
			}

			const verify = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
			if (!verify.ok) return res.status(401).json({ message: 'Invalid Google credential' })
			const payload = await verify.json()
			const emailVerified = payload.email_verified === true || payload.email_verified === 'true'
			if (payload.aud !== clientId || !payload.email || !emailVerified) {
				return res.status(401).json({ message: 'Invalid Google credential' })
			}

			const email = payload.email.toLowerCase()
			let user = await User.findOne({ email: { $in: [email, payload.email] } })
			if (!user) {
				// Google accounts get an unusable random password
				user = new User({
					email,
					password: hashPassword(crypto.randomBytes(32).toString('hex')),
					avatarUrl: payload.picture,
				})
				user.fullname = (payload.name || email.split('@')[0]).trim()
				await user.save()
			} else if (!user.avatarUrl && payload.picture) {
				user.avatarUrl = payload.picture
				await user.save()
			}

			res.status(200).json({ data: generateAllToken({ id: user._id }) })
		} catch (error) {
			console.log('Google login error: ', error.message)
			res.status(500).json({ message: 'Server Error' })
		}
	}

	getAccessToken(req, res) {
		const { refreshToken } = req.body
		if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' })
		const user = verifyToken('refresh', refreshToken)
		if (!user || typeof user !== 'object' || !user.id) {
			return res.status(401).json({ message: 'Invalid refresh token' })
		}
		return res.status(200).json(generateAccessToken({ id: user.id }))
	}

	async changePassword(req, res) {
		try {
			const { oldPassword, newPassword } = req.body
			if (typeof newPassword !== 'string' || newPassword.length < 6) {
				return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
			}
			const user = await User.findById(req.user.id)
			if (!user) return res.status(404).json({ message: 'User not found' })
			if (typeof oldPassword !== 'string' || !verifyHash(oldPassword, user.password)) {
				return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' })
			}
			user.password = hashPassword(newPassword)
			await user.save()
			res.status(200).json({ message: 'Password have changed' })
		} catch (error) {
			console.log('Change password error: ', error.message)
			res.status(500).json({ message: 'Server Error' })
		}
	}
}

module.exports = new AuthController()
