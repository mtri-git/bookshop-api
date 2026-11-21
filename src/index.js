const express = require('express')
const dotenv = require('dotenv')
const db = require('./configs/dbConfig')
const route = require('./route/index')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

dotenv.config()

const app = express()

// CORS_ORIGIN: comma-separated list of allowed origins; unset = allow all (dev)
const corsOrigins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean)
app.use(cors({ origin: corsOrigins?.length ? corsOrigins : true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// connect DB
db.dbConnect()

app.get('/', (req, res) => {
    res.json({ message: 'BookShop API is running', status: 'healthy', timestamp: new Date() })
})

route(app)

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`BookShop API running on port ${PORT}...`)
})
