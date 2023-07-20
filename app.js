// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config()
// }
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const catchAsync = require('./utils/catchAsync')
const expressError = require('./utils/expressError')
const reviews = require('./models/review')
const methodOverride = require('method-override')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const mongoose = require('mongoose')
const campGround = require('./models/campground')
const { campGroundSchema } = require('./schemas')
const { reviewSchema } = require('./schemas')
const mongoSanitize = require('express-mongo-sanitize')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const {MongoStore} = require('connect-mongo')

const mongodbstore = require('connect-mongo')(session)
const dburl = process.env.DB_URL
// 'mongodb://127.0.0.1:27017/shivir'

const passport = require('passport')
const localStrategy = require('passport-local')
const user = require('./models/user')
mongoose.set('strictQuery', true)

mongoose.connect(dburl)
    .then(() => {
        console.log('Database connected!')
    })
    .catch(err => {
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(mongoSanitize())

const store = new mongodbstore({
    url:dburl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24*60*60
})


const sessionConfig = {
    store,
    name: 'benny',
    secret:'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        //secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        //the above addition represents that the session will expire in 1 week i.e 1000ms in 1sec then 60 sec and 
        //60 min and then 24 hours and 7 days in a week
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.deleted = req.flash('deleted')
    res.locals.error = req.flash('error')
    next()
})



//here for using the flash the sequence is very much important first session must be declared and then the flash
//and after that the flash middleware

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use(express.static(path.join(__dirname, 'public')))



app.all('*',(req,res,next)=>{
    next(new expressError('Page not found', 404))
})
app.use((err, req, res, next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statusCode).render('error', {err})
})
const port = process.env.PORT || 1080
app.listen(port, () => {
    console.log(`Server 1080 is ready!`)
})
