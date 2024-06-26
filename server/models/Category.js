const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: true,
    unique: true,
    maxLength: 40,
  },
  description: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});
module.exports = mongoose.model("Category", categorySchema);
