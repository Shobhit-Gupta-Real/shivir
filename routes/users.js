const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const users = require('../controller/users')

router.get('/', (req,res)=>{
    res.render('home')
})

router.get('/register', (req,res)=>{
    res.render('users/register')
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