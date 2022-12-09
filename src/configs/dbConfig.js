const mongoose = require('mongoose')
require('dotenv/config')

const dbConnect = async () => {
    try{
        console.log("Connecting to database")
        await mongoose.connect(process.env.DB_ONLINE)
        console.log("Connect to database successful")
    }
    catch{
        console.log("Connect to database fail")
    }
}

module.exports = {dbConnect}