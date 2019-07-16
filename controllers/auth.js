
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('../models/user');
const User = mongoose.model('user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
require('dotenv').config();

exports.signUp = (req, res) => {

  User.findOne({ "$or": [{ email: req.body.email }, { userName: req.body.userName }] })
    .then(user => {

      if (user) {
        if (user.email === req.body.email) {
          res.json({ error: "User already exists!" });
        }
        else if (user.userName === req.body.userName) {
          res.json({ error: "Username already exists!" });
        }
      }

      else {
        const newUser = {
          fullName: req.body.fullName,
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            new User(newUser).save()
              .then(user => {
                res.status(200).json({ "message": "signup successfull!" });
                //res.redirect('/');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    }).catch(err => console.log(err));
};

exports.login = (req, res) => {
  //find user
 // console.log(req.body);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.json({ error: "User does not exist" });
      } else {

        // Match password
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                    const token=jwt.sign({_id:user._id},process.env.JWT_Key);
                    res.cookie("token",token,{expire:new Date()+ 9999});
                    const {_id,userName,fullName,email}=user;
                    user.password=undefined;
                    return res.json({token,user});
                
              } else {
                  return res.status(401).json({ error: "Incorrect Password" });
              }
          });
      }
    });

};

exports.logout = (req, res) => {
  res.clearCookie('token');
  //res.redirect('/');
  console.log("Signed out successfully!");
  return res.json({message:"Signed out successfully!"});
};

exports.authenticate=expressJwt({
  secret:process.env.JWT_Key,
  userProperty:"auth"
});