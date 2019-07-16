const express=require('express');

//const methodOverride=require('method-override');
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

mongoose.set('useFindAndModify', false);

app.use(cookieParser());

//express-session middleware
/*app.use(session({
  secret: 'secret',
  cookie: { httpOnly: false, secure: false },
  resave: false,
  saveUninitialized: false,
}));*/

//app.use(flash());

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

//using middlewares
//app.use(morgan("dev"));

//use routes
app.use('/',postRoutes);
app.use('/',userRoutes);
app.use('/',auth);

//connect to mongoose
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(()=>console.log('Connected'))
.catch(err=>console.log('Couldn\'t connect',err));


//custom middleware
app.use(function(req,res,next){
  res.locals.user=req.user || null;
  next();
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

/*app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

 // res.setHeader('Access-Control-Allow-Headers','*');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
}); */

//serve static assets in production
if (process.env.NODE_ENV === "production") {
  //app.use(express.static("client/build"));
  app.get("*",(req,res)=>{
    //console.log(path.join(__dirname, '/client/build/index.html'));
    app.use(express.static(path.join(__dirname,'/client/build')));
    const staticPath=path.resolve(__dirname, '/client/build/index.html');
    res.sendFile(staticPath);
  });
}

const port= process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});