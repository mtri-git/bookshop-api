const mongoose = require('mongoose')
const { defineModel } = require('../configs/requestModel')

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

module.exports = defineModel('Category', Category)