const mongoose = require('mongoose')
const { defineModel } = require('../configs/requestModel')

const Publisher = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        maxLength: 100
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    address: String,
    country: String
 });

module.exports = defineModel('Publisher', Publisher)
 