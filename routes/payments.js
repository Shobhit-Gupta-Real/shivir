const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const pay = require('../controller/payment')
const { route } = require('./payments')

router.post('/ongoing', pay.paymenton)
//router.get('/success', pay.success)

module.exports = router