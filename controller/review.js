const campGround = require('../models/campground')
const reviews = require('../models/review')


module.exports.add = async(req,res)=>{
    const camp = await campGround.findById(req.params.id)
    const review = new reviews(req.body.review)
    review.author = req.user._id
    camp.reviews.push(review)
    await review.save()
    await camp.save()
    req.flash('success', 'Your review added')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete = async(req,res)=>{
    const {id, reviewid} = req.params
    const camp = await campGround.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await reviews.findByIdAndDelete(reviewid)
    req.flash('deleted', 'Your review deleted!')
    res.redirect(`/campgrounds/${id}`)
}