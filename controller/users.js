const User = require('../models/user')
const campground = require('../models/campground')
const { campGroundSchema } = require('../schemas')
const { storeReturnTo } = require('../middleware');


module.exports.add = async(req,res)=>{
    try{
    const {email, username, password, owner} = req.body
    const user = new User({email, username, owner})
    const reguser = await User.register(user, password)
    req.login(reguser, err=>{
        if(err) return next(err)
        req.flash('success', `Welcome!`)
        res.redirect('/campgrounds')
    })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
}

module.exports.favourite = async(req,res)=>{
    const {userid, campid} = req.params
    try{
    const camp = await campground.findById(campid)
    const user = await User.findById(userid)
    for(let fav of user.favourite){
        if(fav.equals(campid)){
            req.flash('deleted','Already Added!')
            return res.redirect(`/campgrounds/${campid}`)
        }
    }
    user.favourite.push(camp)
    await user.save()
    req.flash('success', 'Added To Favourites!')
    }catch(e){
        req.flash('error',e.message)
    }
    res.redirect(`/campgrounds/${campid}`)
}

module.exports.reamovefav = async(req,res)=>{
    const userid = req.user._id
    const {campid} = req.params
    const user = await User.findByIdAndUpdate(userid, {$pull: {favourite: campid}})
    req.flash('error','Reamoved From Favourites!')
    res.redirect('/favourite')
}