const router = require('express').Router()
const { isloggedIn, CustomRole } = require('../midleware/user')
const {createOrder} = require("../controller/orderController")

router.post('/create',isloggedIn,createOrder)
