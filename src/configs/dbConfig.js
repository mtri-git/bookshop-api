const mongoose = require('mongoose')
require('dotenv/config')
const { connectionStore } = require('./requestModel')

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

// Express middleware for Cloudflare Workers. Workers forbid global-scope I/O and
// a socket opened in one request cannot be reused by another (the request hangs),
// so every request gets its own Connection, exposed to the models through
// AsyncLocalStorage (see requestModel.js) and closed when the response ends.
const ensureDbConnected = async (req, res, next) => {
    let conn
    try {
        conn = mongoose.createConnection(process.env.DB_ONLINE, { serverSelectionTimeoutMS: 8000, maxPoolSize: 1 })
        for (const name of mongoose.modelNames()) conn.model(name, mongoose.model(name).schema)
        await conn.asPromise()
    } catch (err) {
        console.error('MongoDB connection failed:', err.message)
        conn?.close().catch(() => {})
        return res.status(503).json({ message: 'Database unavailable' })
    }

    let closed = false
    const close = () => {
        if (closed) return
        closed = true
        conn.close().catch(() => {})
    }
    res.on('finish', close)
    res.on('close', close)

    connectionStore.run(conn, next)
}

module.exports = { dbConnect, ensureDbConnected }
