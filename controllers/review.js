const Listing=require("../models/listing");
const Review=require("../models/reviews");

module.exports.submitreviews=async(req,res)=>{
    // console.log(req.body);
    // console.log(req.body.review)
let listing=await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
newReview.author=req.user._id;
console.log(newReview)
    

listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash('success',"New review added successfully!")
// console.log("reviews submit successfully");
res.redirect(`/listings/${listing._id}`)
};

module.exports.deletereview=async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash('success',"review deleted successfully!")
    res.redirect(`/listings/${id}`)
}
