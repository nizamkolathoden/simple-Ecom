const BigPromise = require("../midleware/BigPromise");
const Order = require("../model/order");
const Product = require("../model/product");

exports.createOrder = BigPromise(async (req, res) => {
 
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
      user: req.user._id,
    });
    res.json({ order });
 
});

exports.orderDetials = BigPromise(async(req,res)=>{
  const {id} = req.params
  const orderDetials= await Order.findById(id).populate('user')
  res.json({orderDetials})
})

exports.myOrder=BigPromise(async(req,res)=>{
  const user = req.user._id
  const myOrders = await Order.find({user:user})
  res.json({myOrders})
})


exports.admingetAllOrders = BigPromise(async (_,res) => {
  const orders = await Order.find();

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.admingetUpdateOrders = BigPromise(async(req,res)=>{
  const order = await Order.findById(req.params.id)

  if(order.orderStatus==='delivered'){
    return res.json({error:"Order Delivered"})
  }
  const {orderItems} = orders 

  order.orderStatus = req.body
  orderItems.forEach(pro => {
    updateProductStock(pro.product,pro.quntity)
  });

  await order.save()

  res.status(200).json({
    success: true,
    order,
  })

})

exports.admingetDeleteOrders = BigPromise(async(req,res)=>{
  await Order.findByIdAndDelete(req.params.id)
  res.json({deleted})
})

const updateProductStock = async(prodctId,quntity)=>{
 const prod = await Product.findById(prodctId)

 prod.stock = prod.stock-quntity

 await prod.save()

}