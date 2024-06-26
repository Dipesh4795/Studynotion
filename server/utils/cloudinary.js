const cloudinary = require("cloudinary").v2;

const uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto";

    console.log("here");
    const response = await cloudinary.uploader.upload(
      file.tempFilePath,
      options
    );
    console.log("cloudinary setup");
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = uploadImageToCloudinary;
