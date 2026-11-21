const {verifyToken} = require('../utils/jwtHandle')

const authMiddleware = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const user = verifyToken('access' ,token)
        if(user === 'jwt expired')
            return res.status(400).json({message: "Token expired"})
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = authMiddleware