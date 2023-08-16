const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo, isLoggedIn } = require('../middleware');
const users = require('../controller/users')
const campground = require('../models/campground')

router.get('/', (req,res)=>{
    res.render('home')
})
router.get('/interface',(req,res)=>{
    res.render('users/interface')
})
router.get('/favourite',catchAsync(async(req,res)=>{
    const user = req.user._id
    const data = await User.findById(user).populate('favourite')
    res.render('users/favourite',{data})
}))
router.post('/:userid/favourite/:campid', storeReturnTo, catchAsync(users.favourite))
router.delete('/favourite/:campid', isLoggedIn, catchAsync(users.reamovefav))

router.get('/checklist', catchAsync(async(req,res)=>{
    const user = req.user._id
    const data = await User.findById(user).populate('checklist')
    res.render('users/checklist',{data})
}))
router.post('/:userid/checklist/:campid', storeReturnTo, catchAsync(users.checklist))
router.delete('/checklist/:campid', isLoggedIn, catchAsync(users.reamovecheck))

router.post('/payment/:campid', catchAsync(async(req,res)=>{
    const {campid} = req.params
    const user = req.user._id
    const data = await User.findById(user)
    const camp = await campground.findById(campid)
    data.payment = data.payment+(camp.price*req.body.beds)
    data.save()
    res.redirect('/checklist')
}))

router.get('/register', (req,res)=>{
    const data = req.query.owner;
    res.render('users/register', {data})
})
router.post('/register', catchAsync(users.add))

router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req,res)=>{
    req.flash('success', `Welcome back!`)
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
})
router.get('/logout', (req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('deleted', 'Visit Soon!')
        res.redirect('/campgrounds')
    })
})
module.exports = router 