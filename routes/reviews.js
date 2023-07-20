const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const reviews = require('../models/review')
const campGround = require('../models/campground')
const review = require('../controller/review')
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware')



router.post('/', validateReview, isLoggedIn, catchAsync(review.add))
router.delete('/:reviewid', isLoggedIn, isReviewAuthor, catchAsync(review.delete))

module.exports = router