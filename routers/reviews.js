const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const Review=require("../models/reviews");
const Listing=require("../models/listing");
const {validatereview, isloggedin, isreviewauthor}=require("../middleware.js");
const Reviewcontroller=require("../controllers/review.js")

//reviews
//post route
router.post("/",isloggedin,validatereview,wrapAsync(Reviewcontroller.submitreviews));
//delete review route
router.delete("/:reviewid",isreviewauthor,wrapAsync(Reviewcontroller.deletereview));

module.exports=router;