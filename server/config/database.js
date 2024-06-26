const mongoose=require("mongoose");
require("dotenv").config();
exports.connect=async()=>{
 mongoose.connect(process.env.MONGODB_URL,{
      useNewUrlParser:true,
      useUnifiedTopology: true

 })
 .then(()=>console.log("db connection succsess"))
.catch(
      (error)=>{
            console.log("somthing is error in db connection");
            console.log(error);
            process.exit(1);
      }
)
 }