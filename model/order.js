const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },
  orderItems:[{
    name:{
        type:String,
        required:true
    }, 
    quntity:{
        type:String,
        required:true
    }, 
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    },
  }],
  paymentInfo:{
    id:{
        type:String
    }
  },
  taxAmount:{
    type:Number
  },
  shippingAmount:{
    type:Number
  },
  totalAmount:{
    type:Number
  },
  orderStatus:{
    type:String,
    required:true,
    default:'processing'
  },
  deliveredAt:{
    type:Date
  },
  createdAt:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model('Order',orderSchema)
