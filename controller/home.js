const BigPromise = require("../midleware/BigPromise")

module.exports = {
    sample1:BigPromise((req,res)=>{
        console.log(req.query);
        res.json("sample 1")
    }),
    sample2:(req,res)=>{
        res.json("sample 2")
    },
}