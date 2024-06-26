const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  coursename: {
    type: String,
    required: true,
    trim: true,
  },
  coursedescription: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  whatwillyoulearn: {
    type: String,
    required: true,
    trim: true,
  },
  studentsenrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  price: {
    type: Number,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  coursecontent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  tags: {
    type: [String],
    trim: true,
  },

  ratingandreview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdate: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Course", courseSchema);
