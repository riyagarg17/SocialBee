const express=require('express');

const {allUsers,userById,getUser,updateUser,addFollowing,
    addFollower,removeFollower,removeFollowing,
    deleteUser,allUsersSearch,uploadImage,userPhoto}=require('../controllers/user');
const {authenticate}=require('../controllers/auth');

const router = express.Router();


router.get('/users',allUsers);

router.put('/user/follow',authenticate,addFollowing,addFollower);

router.put('/user/unfollow',authenticate,removeFollowing,removeFollower);

router.post('/users/:searchValue',authenticate ,allUsersSearch);

router.put('/image/:userId',authenticate ,uploadImage);

router.get('/image/:userId',userPhoto);

router.param('userId',userById);

router.get('/user/:userId',authenticate, getUser);

router.put('/user/:userId',authenticate, updateUser);

router.delete('/user/:userId',authenticate, deleteUser);

module.exports=router;