const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const campGround = require('../models/campground')
const flash = require('connect-flash')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const camps = require('../controller/campgrounds')
const {storage} = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({storage})

router.route('/')
    .get(catchAsync(camps.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(camps.addground))



router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/add')
})

router.route('/:id')
    .put( isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(camps.edited))
    .delete(isLoggedIn, isAuthor, catchAsync(camps.delete))
    .get(catchAsync(camps.show))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camps.edit))
router.put('/:id/edit/:imgid', isLoggedIn, isAuthor, catchAsync(camps.remimg))

module.exports = router