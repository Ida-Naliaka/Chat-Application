const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken= require ('../Config/Token');

const nodemailer = require("nodemailer");
const bcrypt= require("bcryptjs");
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


const registerUser= expressAsyncHandler(async(req, res)=>{
    const {name, email, password, pic}= req.body;
    
    if(!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all the Fields');
}
const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let confirmationCode = '';
    for (let i = 0; i < 25; i++) {
      confirmationCode += characters[Math.floor(Math.random() * characters.length )];
}
const userExists= await User.findOne({email});
if (userExists) {
    res.status(400);
    throw new Error('User already exists');
}
const user= await User.create({
    name,
    email,
    password:bcrypt.hashSync(password, 8),
    pic,
    confirmationCode
});
if (user) {
    res.status(201).json({
        _id: user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        confirmationCode: user.confirmationCode
    })
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject:  "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
      <h2>Hello ${user.name}</h2>
      <p>Thank you for signing up to Enchat. Please confirm your email by clicking on the following link</p>
      <a href=http://localhost:3000/auth/${user.confirmationCode}> Click here</a>
      </div>`,
    };
    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
    res.redirect("/")
} else {
    throw new Error('Failed to create user');
}
})

const verifyUser = expressAsyncHandler(async(req, res) => {
   
  User.findOne({confirmationCode: req.params.confirmationCode}).then((user) => {
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    user.status = "Active";
    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      } 
    });
  })
  .catch((e) => console.log("error", e));
   })

const authUser= expressAsyncHandler(async(req, res)=>{
    const { email, password }= req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error('Please fill in all the Fields');
    }
    
    const user= await User.findOne({email});
    
    if (user && (await bcrypt.compare(password, user.password))) {
        if (user.status!='Active') {
             res.status(401).send({
              message: "Pending Account. Please Verify Your Email!",
            });
          } else {
            res.json({
            _id: user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            status:"Active",
            token: generateToken(user._id)
        });}
    } else{
        res.status(401);
        throw new Error('Invalid Email or Password');
    }
})
module.exports={registerUser, verifyUser, authUser}