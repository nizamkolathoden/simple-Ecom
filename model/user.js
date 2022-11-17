const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,'please enter your name'],
        maxlength:[40,'name should be under 40 char']
    },
    email:{
        type:String,
        require:[true,'plz enter email'],
        validate:[validator.isEmail,"please enter valid email"],
        unique:true
    },
    password:{
        type:String,
        require:[true,'plz enter password'],
        select:false
     
    },
    role:{
        type:String,
        default:'user'
    },
    photo:{
       id:String,
       url:String
    },
    forgotPasswordToken:String,
    forgotPasswordExp:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }


})
userSchema.pre('save',async function (next){
    try {
        if(!this.isModified('password'))    
            return next()
        this.password = await bcrypt.hash(this.password,10)
    } catch (err) {
        console.log(err);
    }
})

//validate password 
userSchema.methods.isValidpassword = async function (userPassword){
   
    return await bcrypt.compare(userPassword,this.password)
}

//create jwt

userSchema.methods.getJwtToken  =  function (){
    console.log("called");
    return  jwt.sign({id:this._id},process.env.JWT_SECERT,{
        expiresIn:process.env.JWT_EXPIRY
    })
}

userSchema.methods.getForgotPasswordToken = function(){
    const forgotToken = crypto.randomBytes(20).toString('hex')
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
    //time
    this.forgotPasswordExp=Date.now()+20*60*1000
    return forgotToken
}

module.exports = mongoose.model('user',userSchema)