const express = require('express')
const app = express()
const cloudinary = require('cloudinary')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

//reguler middleware
app.use(express.json())
const morgan = require("morgan")
app.use(morgan('dev'))
require('dotenv').config()

//DB connection and Port
const DB = require('./config/Db')()
const PORT = process.env.PORT||3000;

//cookie and file upload
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

//import all routes
app.use("/api/v1",require('./router/home'))
app.use("/api/v1/user",require('./router/user'))

console.log(process.env.Cloudinary_Api_Secret);
cloudinary.config({
    cloud_name:process.env.Cloudinary_Name,
    api_key:process.env.Cloudinary_Api_Key,
    api_secret:process.env.Cloudinary_Api_Secret
})

// app.get("/",(req,res)=>{
//     console.log(req.protocol);
//     console.log(req.get('host'));

// })

app.listen(PORT,()=>console.log(`Server Running on ${PORT} 🚀 🚀`))