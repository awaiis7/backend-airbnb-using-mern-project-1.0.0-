const Listing=require("./models/listing");
  const Review=require("./models/reviews");
  const Expresserror=require("./utils/expresserror.js");
const {listingSchema,reviewSchema}=require("./schema.js");
  module.exports.isloggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in!");
        return res.redirect("/login")
    }
    next()
};
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
};

module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
// console.log('Request Body:', req.body);
let listing=await Listing.findById(id);
if(!listing.owners._id.equals(res.locals.currUser._id)){
    req.flash('error',"you don't have permission to edit or delete!")
   return res.redirect(`/listings/${id}`)
}
next()
};

module.exports.isreviewauthor=async(req,res,next)=>{
    let { id,reviewid } = req.params;
// console.log('Request Body:', req.body);
let review=await Review.findById(reviewid);
if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash('error',"you are not author !")
   return res.redirect(`/listings/${id}`)
}
next()
};

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errmsg);
    }else{
        next();
    }
};

module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new Expresserror(400,errmsg);
    }else{
        next();
    }
};