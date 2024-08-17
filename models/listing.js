const { ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require("./reviews");
const User=require("./users")

// Define a schema for the `image` subdocument
// const imageSchema = new Schema({
//     filename: { type: String, default: 'listingimage' },
//     url: { type: String, default: 'https://unsplash.com/photos/three-palm-trees-are-silhouetted-against-a-twilight-sky-k_FUqyTo13I' }
// });

// Define the main schema for your listings
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: { url: String, 
       filename:String,
       
     },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owners:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
}, { minimize: false });

//if we delete listing then also delete review model of that particular id(THIS IS MONGOOSE MIDDLEWARE )
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

// Create a Mongoose model based on the schema
const Listing = mongoose.model('Listing', listingSchema);

// Now you can use the Listing model to save and retrieve listings
module.exports = Listing;