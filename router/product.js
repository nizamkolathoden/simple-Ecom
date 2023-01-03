const router = require('express').Router()
const {addProduct, getAllProduct, getOneProduct, updateProduct, deleteProduct, addReview, dleteReview} = require('../controller/product')
const { isloggedIn, CustomRole } = require('../midleware/user')
router.post("/admin/add/product",isloggedIn,CustomRole('admin'),addProduct)

router.route("/admin/product/:id").put(isloggedIn,CustomRole('admin'),updateProduct).delete(isloggedIn,CustomRole('admin'),deleteProduct)

router.get("/getallproduct",getAllProduct)

router.get("/getsingleproduct/:id",getOneProduct)
router.route("/review").delete(isloggedIn,dleteReview).post(isloggedIn,addReview)
// router.delete("//review",isloggedIn,addReview)
// router.post("/pay",paymentControl.captureStripePayment)


module.exports = router