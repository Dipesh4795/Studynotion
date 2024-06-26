const User = require("../models/User.js");
const Category = require("../models/Category.js");
const Course = require("../models/Course.js");
const uploadImageToCloudinary = require("../utils/cloudinary");
const convertSecondsToDuration = require("../utils/secToTimeDuration.js");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      price,
      category,
      tags,
      whatWillYouLearn,
      instructions,
      status = "Draft",
    } = req.body;

    const userid = req.user.id;

    const thumbnail = req.files.thumbnailImage;
    console.log(thumbnail);
    console.log(tags);
    console.log(instructions);
    console.log(whatWillYouLearn);
    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !category ||
      !whatWillYouLearn ||
      !thumbnail ||
      !tags.length ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "data is missing in creating a course",
      });
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "category not found",
      });
    }

    const instructorDeatils = await User.findById(userid);
    if (!instructorDeatils) {
      return res.status(400).json({
        success: false,
        message: "instructor not found",
      });
    }
    // console.log("kya kaam");

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    // console.log("yha per");
    const newCourse = await Course.create({
      coursename: courseName,
      coursedescription: courseDescription,
      price,
      category,
      whatwillyoulearn: whatWillYouLearn,
      tags: JSON.parse(tags),
      instructions: JSON.parse(instructions),
      status,
      thumbnail: thumbnailImage.secure_url,
      instructor: req.user.id,
      ratingandreview: [],
      coursecontent: [],
      studentsenrolled: [],
    });

    await User.findByIdAndUpdate(
      {
        _id: req.user.id,
      },
      {
        $push: { courses: newCourse._id },
      },
      {
        new: true,
      }
    );
    await Category.findByIdAndUpdate(
      {
        _id: category,
      },
      {
        $push: { courses: newCourse._id },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "course create successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: " error in course create ",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        coursename: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingandreview: true,
        studentsenrolled: true,
      }
    )
      .populate("instructor")
      .populate("category")
      .exec();

    return res.status(202).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const courseDetails = await Course.findById({ _id: courseId });

    if (!courseDetails) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      courseDetails.thumbnail = thumbnailImage.secure_url;
    }
    console.log(updates);

    if (updates.coursename) {
      courseDetails.coursename = updates.coursename;
    }
    if (updates.coursedescription) {
      courseDetails.coursedescription = updates.coursedescription;
    }
    if (updates.price) {
      courseDetails.price = updates.price;
    }
    if (updates.category) {
      courseDetails.category = updates.category;
    }
    if (updates.whatwillyoulearn) {
      courseDetails.whatwillyoulearn = updates.whatwillyoulearn;
    }
    if (updates.tags) {
      courseDetails.tags = JSON.parse(updates.tags);
    }
    if (updates.instructions) {
      courseDetails.instructions = JSON.parse(updates.instructions);
    }
    if (updates.status) {
      courseDetails.status = updates.status;
    }
    // for (const key in updates) {
    //   if (courseDetails.hasOwnProperty(key)) {
    //     if (key === "tags" || key === "instructions") {
    //       courseDetails[key] = JSON.parse(updates[key]);
    //     } else {
    //       courseDetails.key = updates?.key;
    //     }
    //   }
    // }

    console.log(courseDetails.coursename);
    await courseDetails.save();

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
    console.log(updatedCourse);
    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    console.log("coursedetails");
    const { courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
      status: "Published",
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

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    //   if (courseDetails.status === "Draft") {
    //     return res.status(403).json({
    //       success: false,
    //       message: `Accessing a draft course is forbidden`,
    //     });
    //   }
    console.log("coursedetails here1");
    let totalDurationInSeconds = 0;
    courseDetails.coursecontent.forEach((content) => {
      content.subsections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeduration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    // console.log("courseid id is", courseId);
    const userid = req.user.id;
    const courseDetails = await Course.findOne({
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
    // console.log("here1");
    let courseProgressCount = await CourseProgress.findOne({
      courseid: courseId,
      userid: userid,
    });

    // console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.coursecontent.forEach((content) => {
      content.subsections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeduration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });
    // console.log("here2");
    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completevideos
          ? courseProgressCount?.completevideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorid = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorid,
    })
      .sort({ createdate: -1 })
      .populate({
        path: "coursecontent",
        populate: {
          path: "subsections",
        },
      });

    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const categoryId = course.category;
    await Category.findByIdAndUpdate(categoryId, {
      $pull: { courses: courseId },
    });
    const studentsEnrolled = course?.studentsenrolled;
    for (const studentid of studentsEnrolled) {
      await User.findByIdAndUpdate(studentid, {
        $pull: { courses: courseId },
      });
    }

    const courseSections = course.coursecontent;
    for (const sectionid of courseSections) {
      const section = await Section.findById(sectionid);
      const subSections = section.subsections;
      for (const subSectionid of subSections) {
        await SubSection.findByIdAndDelete(subSectionid);
      }

      await Section.findByIdAndDelete(sectionid);
    }

    const courseProgressDetail = await CourseProgress.find({
      courseid: courseId,
    });
    const instructorId = course.instructor;
    await User.findByIdAndUpdate(
      instructorId,
      {
        $pull: { courses: courseId },
      },
      {
        new: true,
      }
    );

    for (const eachCourseProgress of courseProgressDetail) {
      const userid = eachCourseProgress.userid;
      await User.findByIdAndUpdate(
        userid,
        {
          $pull: { courseprogess: eachCourseProgress._id },
        },
        {
          new: true,
        }
      );
    }

    await CourseProgress.deleteMany({
      courseid: courseId,
    });

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
