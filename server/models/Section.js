const mongoose=require("mongoose");
const SectionSchema=new mongoose.Schema({

sectionname:{
      type:String,
},
subsections:[
      {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
      }
]
});
module.exports=mongoose.model("Section",SectionSchema);