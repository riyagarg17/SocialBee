const mongoose=require('mongoose');

//db config
//const db=require('../config/mongo');

const Schema=mongoose.Schema;

//creating schema
const postSchema=new mongoose.Schema({
    
    caption:{
        type:String,
    },
    datePosted:{
        type:Date, 
        default:Date.now
    },
    comments:[{
        commentBody:{
            type:String,
            required:true
        },
        commentDate:{
            type:Date,
            default:Date.now
        },
        commentUser:{
            type:Schema.Types.ObjectId,
            ref:'user'
        }
    }],
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    likedBy:[{
        type:Schema.Types.ObjectId,
        ref:'user'
    }],
    photo:{
        data:Buffer,
        contenType:String
    }
});

mongoose.model('post',postSchema,'post');


