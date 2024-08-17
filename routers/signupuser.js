const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const User = require("../models/users.js");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js")
const Usercontroller=require("../controllers/user.js")
//signup routes
router.get("/signup",Usercontroller.signupform);

router.post("/signup",wrapAsync(Usercontroller.getsignupdata));
//login routes
router.get("/login",Usercontroller.loginform);

router.post("/login",saveredirectUrl
    ,passport.authenticate("local",
    {
    failureRedirect:"/login",
    failureFlash:true,
}),Usercontroller.authenticateloginuserdata);

//logout route
router.get("/logout",Usercontroller.logoutuser)


module.exports=router;