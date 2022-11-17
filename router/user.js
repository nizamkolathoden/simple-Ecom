const router = require('express').Router()
const {signup, login,forgotPassword,resetpassword,logout,changePassword, updateDashboard} = require('../controller/userController')
const { isloggedIn } = require('../midleware/user')

router.post("/siginup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotPassword",forgotPassword)
router.post("/password/reset/:token",resetpassword)
router.post("/changepassword",isloggedIn,changePassword)
router.put("/updatedashboard",isloggedIn,updateDashboard)
module.exports = router