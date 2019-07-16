const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const { ObjectId } = mongoose.Schema;
//creating schema
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    fullName: {
        type: String
    },
    userName: String,
    password: String,
    date: {
        type: Date,
        default: Date.now()
    },
    updated: Date,
    image:{
        data:Buffer,
        contentType:String
    },
    followers:[{type:Schema.Types.ObjectId,ref:'user'}],
    following:[{type:Schema.Types.ObjectId,ref:'user'}],
    bio:String
});

mongoose.model('user', userSchema,"user");


