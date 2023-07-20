const mongoose = require('mongoose')
const review = require('./review')
const { string, number } = require('joi')
const Schema = mongoose.Schema

const opts = {toJSON: {virtuals: true}}
const campGroundSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    image: [
        {
        url: String,
        filename: String
    }
    ],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location:{
        type: String,
        required: true
    },
    author:{
        type: Schema.ObjectId,
        ref: 'user'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId, ref:'review'
    }]
}, opts)

campGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,20)}</p>`
})

campGroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('campGround',campGroundSchema)

