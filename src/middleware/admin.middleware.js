const {verifyToken} = require('../utils/adminJwtHandle')

const adminMiddleware = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const user = verifyToken('access' ,token)
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ error: 'Not authorized to access this resource' })
    }

}
module.exports = adminMiddleware