const dotenv = require('dotenv')
dotenv.config()

const db = require('./configs/dbConfig')
const { createApp } = require('./app')

const app = createApp()

// connect DB
db.dbConnect()

const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log(`BookShop API running on port ${PORT}...`)
})
