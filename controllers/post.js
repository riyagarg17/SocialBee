const mongoose=require('mongoose');
const formidable=require('formidable');
const _=require('lodash');
const fs=require('fs');

//loading post model
require('../models/post');
const Post =mongoose.model('post');

exports.getAllPostsByFollowing= (req,res)=>{

    let following=[];
    req.profile.following.map((singleUser,index)=>{
        following.push(singleUser._id);
    });

   // let posts=[];
    //console.log(req.followingUsersId);
    Post.find({postedBy:following}).populate('postedBy','_id userName fullName image ')
    .populate('comments.commentUser', ' _id userName image ')
    .select({"photo":0}).sort({datePosted:'desc'})
    .exec((err,posts)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        if(posts.length==0){
            res.json({message:"Start Following to see posts"});
        }
       
        else{
            res.json(posts);
        }
        
    });
        
};

exports.createPost=(req,res)=>{
    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, function(err, fields, files) {
        if(err){
            return res.send(400).json({error:"image could not be uploaded"});
        }
        let post=new Post(fields);
        post.postedBy=req.profile;
        post.postedBy.password=undefined;
        if(files.photo){
            post.photo.data=fs.readFileSync(files.photo.path);
            post.photo.contenType=files.photo.type;
        }

        post.save((err,result)=>{
            if(err)
                return res.status(400).json({error:err});
            res.status(200).json(result);
        });
    });
};

exports.singlePost = (req, res) => {
    //console.log("single post called");
    return res.json(req.post);
};

exports.postsByUser=(req,res)=>{

    //console.log("post by user called",req.profile._id);
    Post.find({postedBy:req.profile._id}).populate('postedBy','_id userName fullName image ')
    .exec((err,posts)=>{
        if(err){
            return res.status(400).json({error:err});
        }
       // console.log("posts by user",posts);
        res.json(posts);
    });
};

exports.postById=(req,res,next,id)=>{

    Post.findById(id).populate('postedBy','_id userName fullName image ')
    .then(post=>{
        if(!post){
            res.status(400).json({error:"post not found"});
        }
        else{
            req.post=post;
            next();
        }
    });
};

exports.getPostImage=(req,res,next)=>{

    //console.log("getpostImage called");
    if (req.post.photo.data) {
       // console.log("photo found");
        res.set(("Content-Type", req.post.photo.contentType));
        return res.send(req.post.photo.data);
    }
    next();
};

exports.likePost=(req,res)=>{

    //console.log("likepost called",req.body);
    //res.send(req.body);
    Post.findByIdAndUpdate(req.body.postId,{$push:{likedBy:req.body.userId}},
        {new:true})
        .exec((err,post)=>{
            if(err){
                return res.json({error:err});
            }
            else{
                res.json({post:post});
            }
            
        });
};

exports.unlikePost=(req,res)=>{

    console.log("unlikepost called",req.body);
    Post.findByIdAndUpdate(req.body.postId,{$pull:{likedBy:req.body.userId}},
        {new:true}
        ).exec((err,post)=>{
            if(err){
                return res.json({error:err});
            }
            
            res.json({post:post});
        });
};

exports.deletePost=(req,res)=>{

    post=req.post;
    post.remove((err,post)=>{
        if(err){
            return res.status(400).json({error:err});
        }

        res.json({message:"post successfully deleted"});
    });
};

/*exports.hasAutherization=(req,res,next)=>{
    const autherized=req.post && req.auth && req.post._id==req.auth._id;
    if(!autherized){
        return res.status(403).json({error:"Not Autherized"});
    }
    next();
};*/

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);
        post.datePosted = Date.now();

        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.commentUser = req.body.userId;

    const newComment = {
        commentBody: req.body.comment,
        commentUser: req.body.userId
    };

    //console.log("new comment",newComment);

    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: newComment } },
        { new: true }
    )
        .populate("comments.commentUser", "_id userName image")
        .populate('postedBy', '_id userName image')
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                //console.log("new post",post);
                res.json(post);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
    .populate("comments.commentUser", "_id userName")
    .populate("postedBy", "_id userName")
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
               // console.log(post);
                res.json(post);
            }
        });
};