const cookieToken = async(user,res)=>{
    try {
        const token = await user.getJwtToken()
    const option = {
        expires: new Date(
            Date.now()+ 3 * 24 * 60 * 60 * 1000

        ),
        httpOnly:true
    }
    res.cookie('token',token,option).json({token})
    } catch (err) {
        console.log(err);
    }
    
}

module.exports = cookieToken