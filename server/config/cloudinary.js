const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    console.log("cloudinary app connect");
  } catch (error) {
    console.log(error);
    // return res.status(504).json(
    //       {
    //          success:"false",
    //          message:"network error in  cloudinary setup"

    //       }
    // )
  }
};
