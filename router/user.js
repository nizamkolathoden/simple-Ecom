const router = require('express').Router()
const {signup, login,forgotPassword,resetpassword,logout,changePassword, updateDashboard, adminAllUsers, managerAllUsers, singleUser, updateUser, deleteUser} = require('../controller/userController')
const { isloggedIn, CustomRole } = require('../midleware/user')

router.post("/siginup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotPassword",forgotPassword)
router.post("/password/reset/:token",resetpassword)
router.post("/changepassword",isloggedIn,changePassword)
router.put("/updatedashboard",isloggedIn,updateDashboard)


router.get("/admin/allusers",isloggedIn,CustomRole('admin'),adminAllUsers)
router.route("/admin/user/:id")
.get(isloggedIn,CustomRole('admin'),singleUser)
.put(isloggedIn,CustomRole('admin'),updateUser)
.delete(isloggedIn,CustomRole('admin'),deleteUser)




router.get("/manager/allusers",isloggedIn,CustomRole('manager'),managerAllUsers)
// router.delete("/admin/user/:id",deleteUser)
module.exports = router