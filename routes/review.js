const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");





//post Review route   ----review is alwas access with listing so we creat post route

router.post("/" ,isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    console.log("shivam");
    let {id}=req.params;
    
       let listing = await Listing.findById(id);
       console.log("shivam j",id );
               let newReview=   new Review(req.body.review);
               newReview.author = req.user._id; 
               console.log("shivam",listing);
               listing.reviews.push(newReview);
             await  newReview.save();
            await   listing.save();
            req.flash("success","New review Created");
           res.redirect(`/listings/${listing._id}`);
}));

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync( async(req,res)=>{
    let { id , reviewId } = req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success"," review deleted");
   res.redirect(`/listings/${id}`);
}
    
))



// app.get("/testListing", async(req,res)=>{
//     let sampleListing =new Listing({
//         title:"my villa",
//         description:"by the beach",
//         price:1200,
//         location:"dewas",
//     });
//    await sampleListing.save();
//    console.log("sampale was success");
//     res.send("successfult testing");

// });

module.exports = router;
