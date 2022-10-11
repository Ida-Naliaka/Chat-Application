const express= require('express');
const { allUsers } = require('../Controllers/userControllers');
const protect = require('../Middleware/authMiddleware');

const router= express.Router()

router.route("/").get(protect, allUsers);

module.exports = router;