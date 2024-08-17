const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing");
const {isloggedin,isowner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


//index route
router.get("/",wrapAsync(listingcontroller.index));
//NEW ROUTE
router.get("/New",isloggedin,listingcontroller.rendernewform);

//show route
router.get("/:id",wrapAsync(listingcontroller.showlisting));

//create new listing
router.post("/",isloggedin,upload.single("listing[image]"),validatelisting, wrapAsync(listingcontroller.createnewlisting));

//edit route
router.get("/:id/edit",isloggedin,isowner,wrapAsync(listingcontroller.editlisting));

///update route
router.put("/:id",isloggedin, isowner,upload.single("listing[image]"),validatelisting,wrapAsync( listingcontroller.updatelisting));

//delete route
router.delete("/:id",isloggedin,isowner,wrapAsync(listingcontroller.deletelisting));

module.exports=router;

///---------------------------listing routes end------------///