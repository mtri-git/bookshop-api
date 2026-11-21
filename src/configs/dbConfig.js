const mongoose = require('mongoose')
require('dotenv/config')

const dbConnect = async () => {
    try {
        const uri = process.env.DB_ONLINE || 'mongodb://127.0.0.1:27017/bookshop'
        console.log(`Connecting to database (${uri.includes('@') ? 'remote MongoDB' : uri})...`)
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log("Connect to database successful")
    }
    catch (err) {
        console.warn("Database connection warning: Could not connect to MongoDB:", err.message)
        console.warn("API will continue running. Ensure MongoDB is running if performing database queries.")
    }
}

module.exports = { dbConnect }
