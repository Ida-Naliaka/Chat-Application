const express= require ('express');
const { registerUser, authUser, verifyUser } = require('../Controllers/authControllers');
const router= express.Router();


router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/:confirmationCode").get(verifyUser);

module.exports=router;