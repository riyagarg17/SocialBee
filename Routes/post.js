const express=require('express');
const router = express.Router();
const {authenticate}=require('../controllers/auth');
const {userById}=require('../controllers/user');

const {getPost,createPost,postsByUser,postById,hasAutherization,deletePost,
    getFollowing,updatePost,getAllPostsByFollowing,getPostImage,
    unlikePost,likePost,comment,uncomment,singlePost}=require('../controllers/post');

//router.get('/getPosts/:userId',authenticate, getPost);
router.get('/postsby/:userId',authenticate,postsByUser);

router.post('/addPost/:userId',authenticate,createPost);
router.param('userId',userById);
router.param('postId',postById);

//singlepost
router.get('/post/:postId',authenticate,singlePost);
//delete post
router.delete('/post/:postId',authenticate,deletePost);
//get post image
router.get('/postImage/:postId',getPostImage);
router.put('/post/:postId',authenticate, updatePost);

//increase like
router.put('/like',authenticate,likePost);

//decrease like
router.put('/unlike',authenticate,unlikePost);

// comments
router.put("/comment", authenticate, comment);
router.put("/uncomment", authenticate, uncomment);

//show posts by all following
router.get('/getPosts/:userId',authenticate,getAllPostsByFollowing);



module.exports=router;
