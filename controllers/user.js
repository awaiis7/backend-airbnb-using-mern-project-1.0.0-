const Listing=require("../models/listing");
const User=require("../models/users");

module.exports.signupform=(req,res)=>{
    // res.render("./user/signup.ejs")
    // console.log(req)
    res.render("./user/signup.ejs")
};

module.exports.getsignupdata=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newuser=new User({username,email});
        const registereduser=await User.register(newuser,password);
        // console.log(registereduser);
        req.login(registereduser,(err)=>{
            // console.log(err)
            if(err){
               return next(err)
            }
            req.flash("success","welcome to wanderlust")
        res.redirect("/listings");
        })
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }

};

module.exports.loginform=(req,res)=>{
    // res.render("./user/signup.ejs")
    // console.log(req)
    res.render("./user/login.ejs")
};

module.exports.authenticateloginuserdata=async(req,res)=>{
    req.flash("success","welcome back wander lust");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
    };

    module.exports.logoutuser=(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","you are logged out!");
            res.redirect("/listings")
        })
    };