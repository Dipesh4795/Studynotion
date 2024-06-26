const Course = require("../models/Course.js");
const Section = require("../models/Section.js");
const SubSection = require("../models/SubSection.js");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    console.log(sectionName);
    if (!sectionName || !courseId) {
      return res.status(404).json({
        success: false,
        message: "data not found to create section",
      });
    }

    const newSection = await Section.create({ sectionname: sectionName });
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: { coursecontent: newSection._id },
      },
      { new: true }
    )
      .populate({
        path: "coursecontent",
        populate: {
          path: "subsections",
        },
      })
      .exec();
    return res.status(202).json({
      success: true,
      message: "able to create section",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: "unable to create section",
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionId, sectionName, courseId } = req.body;
    if (!sectionId || !sectionName) {
      return res.status(402).json({
        success: false,
        message: " data missing in update section",
      });
    }
    const updateSection = await Section.findByIdAndUpdate(sectionId, {
      sectionname: sectionName,
    }).exec();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionaldetails",
        },
      })
      .populate("category")
      .populate("ratingandreview")
      .populate({
        path: "coursecontent",
        populate: {
          path: "subsections",
        },
      })
      .exec();
    return res.status(202).json({
      success: true,
      message: "update section",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: "unable to update section",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.body;
    // const {courseid,sectionid}=req.params;
    if (!courseId || !sectionId) {
      return res.status(402).json({
        success: false,
        message: " data missing in delete section",
      });
    }

    const sectionDetails = await Section.findById(sectionId);
    const courseDetails = await Course.findById(courseId);
    if (!sectionDetails || !courseDetails) {
      return res.status(402).json({
        success: false,
        message: " data wrong in delete section",
      });
    }
    console.log("here1");
    await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          coursecontent: sectionId,
        },
      },
      {
        new: true,
      }
    );
    console.log("here1");
    await SubSection.deleteMany({ _id: { $in: sectionDetails.subsections } });
    await Section.findByIdAndDelete(sectionId);
    console.log("here2");
    const CourseDetails = await Course.findById(courseId)
      .populate({
        path: "coursecontent",
        populate: {
          path: "subsections",
        },
      })
      .exec();
    console.log("delete course", CourseDetails);
    return res.status(202).json({
      success: true,
      data: CourseDetails,
      message: "able to delete section",
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: "unable to delete section",
    });
  }
};
