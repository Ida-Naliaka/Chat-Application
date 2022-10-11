const jwt= require('jsonwebtoken');
const User = require('../Models/userModel');
const dotenv=require("dotenv");
dotenv.config();
const expressAsyncHandler= require('express-async-handler')

const protect= expressAsyncHandler(async(req, res, next)=>{
let token;
if (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")) {
        try {
            token=req.headers.authorization.split(" ")[1];//split it and take the token
          //decodes token id
            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            req.user= await User.findById(decoded.id).select("-password");//return without the password
            next()
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorized, Token Failed')
        }
} 
if(!token) {
    res.status(401) ;
        throw new error ('Not Authorized, No Token');
}
})

module.exports = protect;