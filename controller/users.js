const User = require('../models/user')



module.exports.add = async(req,res)=>{
    try{
    const {email, username, password} = req.body
    const user = new User({email, username})
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