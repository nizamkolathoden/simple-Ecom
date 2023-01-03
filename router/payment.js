const router = require('express').Router()
const { isloggedIn, CustomRole } = require('../midleware/user')
const paymentControl = require("../controller/paymentController")

router.get('/stripekey',isloggedIn,paymentControl.sendStripeKey)
router.get('/stripekey',isloggedIn,paymentControl.sendRazorpayKey)

router.post('/capturestripe',isloggedIn,paymentControl.captureStripePayment)
router.post('/capturerazorpay',isloggedIn,paymentControl.captureRazorpayPayment)



module.exports = router
