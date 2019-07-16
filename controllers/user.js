const express=require('express');
const mongoose = require('mongoose');
require('../models/user');
const User=mongoose.model('user');
const formidable=require('formidable');
const _=require('lodash');
const fs=require('fs');

/*exports.userProfile=(req,res)=>{
    //console.log('request received');
    User.find({ user:req.user.id})
    .then(user=>{
        res.json({user});
    });
};*/

exports.allUsers=(req,res)=>{
    User.find()
    .then(users=>{
        res.json({users});
    })
    .catch(err=>res.json(err));
};

exports.allUsersSearch=(req,res)=>{
    //res.send("received",req.body);
    User.find({"userName": { "$regex": req.params.searchValue, "$options": "i" }})
    .select({ "password": 0, "date": 0,"followers": 0,"following": 0,"email": 0})
    .then(users=>{
        res.json({users:users});
    })
    .catch(err=>res.json(err));
};

exports.getUser=(req,res)=>{
    //console.log('request received');
    req.profile.password=undefined;
    return res.json(req.profile);
};

exports.userById=(req,res,next,id)=>{
    User.findByIdAndUpdate(id).populate('followers','_id userName fullName image')
    .populate('following','_id userName fullName image')
    .then(user=>{
        if(!user){
            res.status(400).json({error:"User not found"});
        }
        else{
            req.profile=user;
            next();
        }
    });
};

exports.hasAutherization=(req,res,next)=>{
    const autherized=req.profile && req.auth && req.profile._id==req.auth._id;
    if(!autherized){
        return res.status(403).json({error:"Not Autherized"});
    }

    next();
};

exports.updateUser=(req,res)=>{
    console.log("update user called");
    let user=req.profile;
    user=_.extend(user,req.body);
    user.updated=Date.now();
    user.save()
    .then(user=>{
        //console.log(user);
        if(!user){
            return res.json({error:"not autherized"});
        }else{
            user.password=undefined;
            res.json({user:user});
        }
    });
    /*let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.password=undefined;
            res.json({user:user});
        });
    });*/
};

exports.deleteUser=(req,res)=>{
    let user=req.profile;
    user.remove((err,user)=>{
        if(err){
            res.status(400).json({error:err});
        }

        return res.json({message:"Account successfully deleted"});
    });
};

exports.uploadImage=(req,res)=>{

    let form=new formidable.IncomingForm();
    form.keepExtensions=true;
    form.parse(req, function(err, fields, files) {
        if(err){
            return res.json({error:"image could not be uploaded"});
        }
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.image.data = fs.readFileSync(files.photo.path);
            user.image.contentType = files.photo.type;
        }

        user.save((err,result)=>{
            if(err)
                return res.status(400).json({error:err});
            user.password=undefined;
            res.status(200).json({user:user});
        });
    });
};

exports.userPhoto = (req, res, next) => {
    //console.log(req.profile.image.data);
    if (req.profile.image.data) {
        res.set(("Content-Type", req.profile.image.contentType));
        return res.send(req.profile.image.data);
    }
    next();
};


/* exports.updateUser = (req, res) => {
    let user = req.profile;
    User.findOne({ "$or": [{ email: req.body.email }, { userName: req.body.userName }] })
        .then(user => {
            if (user) {
                res.json({ error: "User already exists" });
            }
            else {
                user = _.extend(user, req.body);
                //console.log(user);
                user.updated = Date.now();
                user.save()
                    .then(user => {
                        //console.log(user);
                        if (!user) {
                            return res.json({ error: "not autherized" });
                        } else {
                            user.password = undefined;
                            res.json({ user: user });
                        }
                    });
            }
        });
};*/

exports.addFollowing=(req,res,next)=>{
   // console.log("following added",req.body);
    User.findByIdAndUpdate(req.body.userId,{$push:{following:req.body.followId}},(err,user)=>{
        if(err){
            return res.json({error:err});
        }
        next();
    });
    next();
};

exports.addFollower=(req,res)=>{
   // console.log("follower added",req.body);
    User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.body.userId}},
        {new:true}
        ).populate('following','_id userName fullName image')
        .populate('followers','_id userName fullName image')
        .exec((err,user)=>{
            if(err){
                return res.json({error:err});
            }
            user.password=undefined;
            res.json({user:user});
        });
};

exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(
        req.body.userId,
        { $pull: { following: req.body.followId } },
        (err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            next();
        }
    );
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $pull: { followers: req.body.userId } },
        { new: true }
    )
        .populate("following", "_id name fullName image")
        .populate("followers", "_id name fullName image")
        .exec((err,user) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            user.password = undefined;
            res.json({user:user});
        });
};