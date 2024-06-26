const mongoose = require("mongoose");
const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    requried: true,
    maxlength: 50,
  },
  description: {
    type: String,
  },
  videourl: {
    type: String,
    required: true,
  },
  timeduration: {
    type: String,
  },
});
module.exports = mongoose.model("SubSection", subSectionSchema);
