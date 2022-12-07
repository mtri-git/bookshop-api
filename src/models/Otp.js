const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Otp = new Schema(
    {
        userId: String,
        otp:{
            type: String,
            index: {expires: 600}
        }
    }
)