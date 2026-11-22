const mongoose = require('mongoose')
const { defineModel } = require('../configs/requestModel')

const Cart = new mongoose.Schema({
    cart_item: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            quantity: Number
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
 });

module.exports = defineModel('Cart', Cart)
 