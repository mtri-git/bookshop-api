const { verifyToken } = require('../utils/jwtHandle')

// Always answers 401 when the token is missing, invalid or expired so clients
// can treat 401 as "refresh the token and retry".
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'Missing token' })

    const user = verifyToken('access', token)
    if (!user || typeof user !== 'object' || !user.id) {
        return res.status(401).json({ message: user === 'jwt expired' ? 'Token expired' : 'Not authorized' })
    }
    req.user = user
    next()
}

module.exports = authMiddleware
