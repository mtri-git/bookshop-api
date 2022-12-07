const mongoose = require('mongoose')

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

module.exports = mongoose.model('Cart', Cart)
 