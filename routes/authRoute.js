const express = require('express');
const authMiddleware = require('../config/authMiddleWare');
const { registerUser,loginUser,userData,updateUser } = require('../controller/authController');

const router = express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/userAuth',authMiddleware,userData);
router.post('/update',updateUser);

module.exports = router;
