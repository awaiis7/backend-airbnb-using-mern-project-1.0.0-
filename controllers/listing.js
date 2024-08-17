const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
};

module.exports.rendernewform=(req,res)=>{
   
    res.render ("./listings/new.ejs")
    
};

module.exports.showlisting=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    }).populate("owners");
    if(!listing){
        req.flash('error',"Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    // console.log(listing)
    res.render("./listings/show.ejs",{listing})
};

module.exports.createnewlisting=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "..", filename);

    const newlist=new Listing(req.body.listing);
    newlist.owners=req.user._id;
    newlist.image={url,filename}
    await newlist.save();
     req.flash('success',"new listing added successfully!")
      res.redirect("/listings");
};

module.exports.editlisting=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash('error',"Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    res.render("./listings/edit.ejs",{listing})
    };

    module.exports.updatelisting=async (req, res,next) => {

        let { id } = req.params;
        let updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
    
            let url=req.file.path;
            let filename=req.file.filename;
            updatedListing.image={url,filename};
            await updatedListing.save();
        
    
            req.flash('success'," listing updated successfully!")
            console.log('Updated Listing:', updatedListing);
            res.redirect(`/listings/${id}`);
            // next()
        
        };

        module.exports.deletelisting=async(req,res)=>{
            let {id}=req.params;
            
                let deletedListing = await Listing.findByIdAndDelete(id);
                req.flash('success'," listing deleted successfully!")
                console.log('deletedListing:', deletedListing);
                res.redirect("/listings");
            
            
            };