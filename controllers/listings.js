const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderAdminDashboard = async (req, res) => {
    const allListings = await Listing.find({});
    console.log("shvaam");
    console.log(allListings);
    res.render("listings/admin.ejs", { allListings });
};

module.exports.workFlow = async (req, res) => {
    res.render("listings/workFlow.ejs");
};



module.exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'success' or 'pending' from the form
    console.log(`shivam jadham${id}`);
    await Listing.findByIdAndUpdate(id,{status:"success"});
    req.flash(`${id}`);
    // req.flash("success", `Listing status updated to Success`);
    res.redirect(`/listings/admin`);
   
    }


module.exports.road = async (req,res)=>{
    res.render("listings/roadDamage.ejs");
};

module.exports.education = async (req,res)=>{
    res.render("listings/education.ejs");
};

module.exports.electricity = async (req,res)=>{
    res.render("listings/electricityIssue.ejs");
};

module.exports.health = async (req,res)=>{
    res.render("listings/healthIssue.ejs");
};

module.exports.sanitation = async (req,res)=>{
    res.render("listings/sanitationIssue.ejs");
};

module.exports.water = async (req,res)=>{
    res.render("listings/waterIssue.ejs");
};

module.exports.category = async (req,res)=>{
    let {c} = req.params;
    const allListings= await Listing.find({category:{$in: c}});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm =  (req,res)=>{
    res.render("listings/new.ejs");
 };

 module.exports.renderAdmin =  (req,res)=>{
    res.render("listings/admin.ejs");
 };

 module.exports.showListing = async (req,res)=>{
     
     let {id} = req.params;
      const listing= await  Listing.findById(id)
      .populate({path:"reviews",
         populate:{
             path:"author",
         },
      })
      .populate("owner");
      if(!listing){
         req.flash("success"," Listing you requested for does not exist");
         res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing});
 }

 module.exports.createListing = async(req,res ,next)=>{ //3 use joi

    
 
    let url= req.file.path;
    let filename=req.file.filename;
   
    // const newListing= new Listing(req.body.listing);
    const newListing= new Listing({
        title:req.body.listing.title,
        description:req.body.listing.description,
        image: {
            filename: filename,  // The filename value you're assigning
            url: req.body.listing.image  // The URL or the path to the image
        },
        // price:req.body.listing.price,
        category:req.body.listing.category,
        country:req.body.listing.country,
        location:req.body.listing.location,
    });

   newListing.owner =req.user._id;
   newListing.image = {url,filename};
    await newListing.save();

    req.flash("success","New Listing Created");
  
    res.redirect("/listings");

}

module.exports.renderEditFrom = async(req,res)=>{
    let {id}=req.params;
  let listing  =await Listing.findById(id);
  if(!listing){
    req.flash("success"," Listing you requested for does not exist");
    res.redirect("/listings");
 }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async(req,res)=>{
  
    let {id}=req.params;
    const {title,description,image,country,location}=req.body.listing;//here we have listing object inside the body
    console.log(image);
    console.log(description);

    if(typeof req.file !== 'undefined'){
         let url= req.file.path;
    let filename=req.file.filename;
     await Listing.findByIdAndUpdate(id, { 'image.filename': filename });
   await Listing.findByIdAndUpdate(id, { 'image.url': url });
    }
    

    let listing = await Listing.findById(id);
 

   await Listing.findByIdAndUpdate(id,{title:title});
   await Listing.findByIdAndUpdate(id,{description:description});
  

//    await Listing.findByIdAndUpdate(id,{price:price});
   await Listing.findByIdAndUpdate(id,{country:country});
   await Listing.findByIdAndUpdate(id,{location:location});
// await Listing.findByIdAndUpdate(id,{...req.body.listing});

//    console.log({...req.body.listing});

req.flash("success"," Listing Updated");
   res.redirect(`/listings/${id}`);
}


module.exports.statusListing = async(req,res)=>{
 
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{status:success});
   req.flash("success"," Listing Updated");
   res.redirect(`/listings/${id}`);
}
// --------------

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing is deleted");
    res.redirect("/listings");
}