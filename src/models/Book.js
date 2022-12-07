const mongoose = require('mongoose')

const Book = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    imageUrl: String,
    price: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    sale: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true,
        maxLength: 2000
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    publication_year: {
        type: Number,
        required: true
    },
    inventory:{
        type: Number,
        default: 0
    },
    sold:{
        type: Number,
        default: 0
    },
    author: String,
    publisher: {},
    category: [{
        type: String
    }]
})

Book.pre('update', ()=>{
    if(this.inventory === this.sold)
        this.status = 'out of stock'
    else{
        this.status = 'available'
    }
})

module.exports = mongoose.model('Book', Book)