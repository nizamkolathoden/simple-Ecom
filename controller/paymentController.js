const BigPromise = require("../midleware/BigPromise");
const stripe = require("stripe")(process.env.STRIPEPRIVATEKEY)
const Razorpay = require("razorpay")
exports.sendStripeKey = BigPromise(async(req,res)=>{
    res.json({stripeKey:process.env.STRIPEPUBLICKEY})
})

exports.captureStripePayment = BigPromise(async(req,res)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"INR",
        // payment_method_types:['card']
        metadata:{integration_check:'accept_a_payment'}
    })

    res.json(paymentIntent)
    
})

exports.sendRazorpayKey = BigPromise(async(req,res)=>{
    res.json({razorpayKey:process.env.RAZORPAY_API_KEY})
}) 

exports.captureRazorpayPayment = BigPromise(async(req,res)=>{
    

    const instance = new Razorpay({ 
        key_id: process.env.RAZORPAY_API_KEY,
         key_secret:process.env.RAZORPAY_SECRET })


         const options = {
            
                amount: 50000,
                currency: "INR",
                receipt: "receipt#1",
                notes: {
                  key1: "value3",
                  key2: "value2"
                }
              
         }

    const myOrder = await instance.orders.create(options)

    res.json(myOrder)
    
})
