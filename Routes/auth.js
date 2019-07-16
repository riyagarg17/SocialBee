const express=require('express');
const router=express.Router();
const {signupValidator}=require('../controllers/validator');
const {signUp,login,logout}=require('../controllers/auth');
const {userById}=require('../controllers/user');

//user signup form 
router.post('/signup',signupValidator,signUp);

//user login form
router.post('/login',login);

router.get('/logout',logout);

router.param('userId',userById);

module.exports=router;