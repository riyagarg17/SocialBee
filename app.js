const express=require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const path=require('path');
const expressValidator=require('express-validator');
//const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors=require('cors');
//const jsonwebtoken = require('jsonwebtoken');
//const morgan=require('morgan');

const app=express();

app.use(cookieParser());

app.use(cors());

require('dotenv').config();

//db config
const db=require('./config/mongo');

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//validator middleware
app.use(expressValidator());

//load routes
const postRoutes=require('./Routes/post');
const userRoutes=require('./Routes/user');
const auth=require('./Routes/auth');

//use routes
app.use('/',postRoutes);
app.use('/',userRoutes);
app.use('/',auth);

//connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(()=>console.log('Connected'))
.catch(err=>console.log('Couldn\'t connect',err));

mongoose.set('useFindAndModify', false);

//custom middleware
/*app.use(function(req,res,next){
  res.locals.user=req.user || null;
  next();
});*/

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});


//serve static assets in production
const root = require('path').join(__dirname, 'client', 'build');
app.use(express.static(root));
if (process.env.NODE_ENV === "production") {
  //app.use(express.static("client/build"));
  app.get("*",(req,res)=>{
    res.sendFile('index.html', { root });
  });
}

const port= process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});