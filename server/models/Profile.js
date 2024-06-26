const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
  },
  contactnumber: {
    type: Number,
    trim: true,
  },
  aboutme: {
    type: String,
    trim: true,
  },
  dob: {
    type: String,
  },
});
module.exports = mongoose.model("Profile", profileSchema);
