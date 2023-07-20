const { string } = require('joi')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
})
  
userSchema.plugin(passportLocalMongoose)
//this plug in will automatically add the username and password input in schema
module.exports = mongoose.model('user', userSchema)