const mongoose = require('mongoose')

const Category = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 100,
        required: true,
    },
    description: {
        type: String,
        maxLength: 1000,
        required: true,
    }
})

module.exports = mongoose.model('Category', Category)