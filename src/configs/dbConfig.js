const mongoose = require('mongoose')

const dbConnect = async () => {
    try{
        console.log("Connecting to database")
        await mongoose.connect("mongodb://localhost:27017/BookShop")
        console.log("Connect to database successful")
    }
    catch{
        console.log("Connect to database fail")
    }
}

module.exports = {dbConnect}