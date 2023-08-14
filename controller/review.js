const campGround = require('../models/campground')
const reviews = require('../models/review')


module.exports.add = async(req,res)=>{
    const camp = await campGround.findById(req.params.id)
    const review = new reviews(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    if(camp.rating === 0){
        camp.rating = review.rating
    }else{camp.rating = Math.floor((camp.rating + review.rating)/(2))}
    await review.save()
    await camp.save()
    req.flash('success', 'Your review added')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete = async(req,res)=>{
    const {id, reviewid} = req.params
    const camper = await campGround.findById(id)
    const review = await reviews.findById(reviewid)
    if(camper.reviews.length === 1){
        camper.rating = 0;
    }else{camper.rating = Math.floor(((camper.rating*camper.reviews.length)-review.rating)/(camper.reviews.length-1))}
    const camp = await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await reviews.findByIdAndDelete(reviewid)
    await camper.save()
    req.flash('deleted', 'Your review deleted!')
    res.redirect(`/campgrounds/${id}`)
}