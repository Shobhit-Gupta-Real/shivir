const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model("review", reviewSchema)