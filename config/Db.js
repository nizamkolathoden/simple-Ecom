const mongoose = require("mongoose")
const connectWithDb = ()=>{
    mongoose.connect(process.env.DB)
    .then(()=>console.log('Connected DB'))
    .catch(err=>{
        console.log("DB connection issues");
        console.log(err);
        process.exit(0)
    })
}

module.exports = connectWithDb