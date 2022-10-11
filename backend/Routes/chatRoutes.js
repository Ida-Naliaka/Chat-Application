const express= require ('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../Controllers/chatControllers');
const protect = require('../Middleware/authMiddleware');
const router= express.Router();

router.route('/').post(protect, accessChat);// cant access chat if not logged in
router.route('/').get(protect, fetchChats);// fetch all the users chats
router.route('/group').post(protect, createGroupChat);// fetch all the users chats
router.route('/rename').put(protect, renameGroup);// fetch all the users chats
router.route('/groupadd').put(protect, addToGroup);// fetch all the users chats
router.route('/groupremove').put(protect, removeFromGroup);// fetch all the users chats


module.exports=router;