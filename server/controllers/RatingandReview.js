const RatingAndReview = require("../models/RatingAndReview.js");
const Course = require("../models/Course.js");
const mongoose = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    console.log("rating here1");
    const userid = req.user.id;
    const { rating, review, courseId } = req.body;
    if (!userid || !rating || !review || !courseId) {
      return res.status(404).json({
        message: "fill all data while giving rating",
        success: false,
      });
    }
    console.log("rating here2");
    const uid = new mongoose.Types.ObjectId(userid);
    const courseDetails = await Course.findOne({
      _id: courseId,
      // studentsenrolled: { $elematch: { $eq: uid } },
    });
    console.log("rating here3");
    if (!courseDetails) {
      return res.status(404).json({
        message: "you are not enrolled in this course",
        success: false,
      });
    }

    const newcourseid = new mongoose.Types.ObjectId(courseId);
    console.log(courseId);
    console.log(newcourseid);

    const ratingDetails = await RatingAndReview.findOne({
      user: uid,
      course: newcourseid,
    });

    if (ratingDetails) {
      return res.status(404).json({
        message: "you already give rating",
        success: false,
      });
    }
    console.log("rating here4");
    const ratingData = await RatingAndReview.create({
      user: userid,
      review: review,
      rating: rating,
      course: courseId,
    });
    courseDetails.ratingandreview.push(ratingData._id);
    await courseDetails.save();
    console.log(courseDetails);
    return res.status(200).json({
      success: true,
      message: "rating give",
      courseDetails,
    });
  } catch (error) {
    return res.status(504).json({
      message: "server error",
      success: false,
    });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const courseid = req.body;

    const result = await RatingAndReview.aggregate([
      {
        $match: { course: new mongoose.Types.ObjectId(courseid) },
      },
      {
        $group: {
          _id: null,
          averagerating: { $avg: "$rating" },
        },
      },
      {
        $sort: {
          averagerating: -1,
        },
      },
    ]);
    if (rating.length > 0) {
      return res.status(204).json({
        success: true,
        message: "average rating  of the course is found",
        averagerating: result[0].averagerating,
      });
    } else {
      return res.status(204).json({
        success: true,
        message: "average rating  of the course is found which is 0",
        averagerating: 0,
      });
    }
  } catch (error) {
    return res.status(504).json({
      success: false,
      message: "average rating not found",
    });
  }
};

exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstname lastname email image",
      })
      .populate({
        path: "course",
      })
      .exec();
    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
