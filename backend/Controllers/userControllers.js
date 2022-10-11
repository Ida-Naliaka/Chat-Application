const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

//search for users 
const allUsers = expressAsyncHandler(async (req, res) => {

const users = await User.find({$or: [
    { name: { $regex: req.query.search, $options: "i" } },
    { email: { $regex: req.query.search, $options: "i" } },
],
})
const searchRes = users.filter((u)=>u._id !== req.user._id)
    res.send(searchRes);
});

  

module.exports={allUsers };