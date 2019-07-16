
exports.signupValidator=(req,res,next)=>{

    req.check("userName","Username is required").notEmpty();
    req.check("userName").isLength({max:32,min:4}).withMessage("Username must be 4 to 32 characters");
    req.check("email","email is required").matches(/[^@]+@[^\.]+\..+/);
    req.check("password","password is required").notEmpty();
    req.check("fullName","full name is required").notEmpty();
    req.check("password").isLength({max:32,min:6}).withMessage("Password must be atleast 6 characters")
    .matches(/\d/).withMessage("Password must be contain atleast 1 digit");

    //check for errors
    const errors=req.validationErrors();
    if(errors){
        const firstError=errors.map(error=>error.msg)[0];
        return res.json({error:firstError});
    }

    next();
};