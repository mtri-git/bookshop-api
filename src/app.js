const express = require('express')
const route = require('./route/index')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const createApp = ({ beforeRoutes = [] } = {}) => {
    const app = express()

    // CORS_ORIGIN: comma-separated list of allowed origins; unset = allow all (dev)
    const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean)
    app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true }))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cookieParser())
    // Simple request logger (morgan compiles formats with new Function(), which Workers forbid)
    app.use((req, res, next) => {
        const start = Date.now()
        res.on('finish', () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`))
        next()
    })
    app.get('/', (req, res) => {
        res.json({ message: 'BookShop API is running', status: 'healthy', timestamp: new Date() })
    })

    beforeRoutes.forEach((mw) => app.use(mw))
    route(app)
    return app
}

module.exports = { createApp }
