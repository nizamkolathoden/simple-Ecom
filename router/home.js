const router = require("express").Router()
const {sample1,sample2} = require('../controller/home')
router.get("/sample1",sample1)

router.get("/sample2",sample2)



module.exports = router