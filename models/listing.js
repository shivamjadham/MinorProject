

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url:String,
    filename:String,
     },

  category:String,
  location: String,
  country: String,
  status: {
    type: String,
    default: "pending" 
  },
  date: {
    type: Date,
    default: Date.now // sets the default to the current date/time
  },
    reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
   },
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;