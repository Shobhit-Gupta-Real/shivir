const { campGroundSchema, reviewSchema } = require('./schemas')
const expressError = require('./utils/expressError')
const campGround = require('./models/campground')
const review = require('./models/review')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in')
        return res.redirect('/login')
    }
    next()
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    const {error} = campGroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }else{
        next()
    }
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params
    const camp = await campGround.findById(id)
    if(!camp.author.equals(req.user._id) && process.env.MASTER_USER !== req.user.username){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    }else{
        next()
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id, reviewid} = req.params
    const camp = await campGround.findById(id)
    const reviews = await review.findById(reviewid)
    if(!(reviews.author.equals(req.user._id) || camp.author.equals(req.user._id) || process.env.MASTER_USER === req.user.username)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}