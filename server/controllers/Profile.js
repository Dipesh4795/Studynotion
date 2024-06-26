const Profile = require("../models/Profile.js");
const User = require("../models/User.js");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const cronejob = require("cron");
const uploadImageToCloudinary = require("../utils/cloudinary.js");
const convertSecondsToDuration = require("../utils/secToTimeDuration.js");
const mongoose = require("mongoose");

exports.updateProfile = async (req, res) => {
  try {
    const { firstname, lastname, contactnumber, gender, dob, aboutme } =
      req.body;
    const userid = req.user.id;
    const userDetails = await User.findById(userid);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user  is missing",
      });
    }
    const profileid = userDetails.additionaldetails;
    const profileDetails = await Profile.findOne(profileid);

    if (firstname !== undefined) {
      userDetails.firstname = firstname;
    }
    if (lastname !== undefined) {
      userDetails.lastname = lastname;
    }

    userDetails.save();
    if (contactnumber !== undefined) {
      profileDetails.contactnumber = contactnumber;
    }
    if (gender !== undefined) {
      profileDetails.gender = gender;
    }
    if (dob !== undefined) {
      profileDetails.dob = dob;
    }
    if (aboutme !== undefined) {
      profileDetails.aboutme = aboutme;
    }

    profileDetails.save();

    const updatedUserDetails = await User.findById(userid)
      .populate("additionaldetails")
      .exec();

    return res.status(201).json({
      success: true,
      message: "profile updated",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: " error in profile updated",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userid = req.user.id;
    console.log("delete");
    const user = await User.findById({ _id: userid });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // sechdule a job

    // const month = today.getMonth();
    // const date = today.getDate();
    // const year = today.getFullYear();
    // const job= new croneJob(
    //       `0 0 ${date+5}`

    // / )

    // IMP LINE for change into object id

    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionaldetails),
    });
    for (const courseid of user.courses) {
      await Course.findByIdAndUpdate(
        courseid,
        { $pull: { studentsenrolled: userid } },
        { new: true }
      );
    }
    await CourseProgress.deleteMany({ userid: userid });

    await User.findByIdAndDelete({ _id: userid });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: " error in delete Account",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionaldetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    console.log(displayPicture);
    const userid = req.user.id;

    const response = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    // console.log("happy");
    console.log(response);

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userid },
      { image: response.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const instructorid = req.user.id;
    const courseDetails = await Course.find({ instructor: instructorid });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsenrolled.length;
      const totalAmountGenerated =
        totalStudentsEnrolled * parseFloat(course.price);

      const courseDataWithStats = {
        _id: course._id,
        coursename: course.coursename,
        coursedescription: course.coursedescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      };

      return courseDataWithStats;
    });

    res
      .status(200)
      .json({ message: "instructor data fetched", courses: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userid = req.user.id;
    let userDetails = await User.findOne({
      _id: userid,
    })
      .populate({
        path: "courses",
        populate: {
          path: "coursecontent",
          populate: {
            path: "subsections",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }

    userDetails = userDetails.toObject();

    for (let i = 0; i < userDetails.courses.length; i++) {
      let subsectionLength = 0;
      let totalTimeInSeconds = 0;
      for (let j = 0; j < userDetails.courses[i].coursecontent.length; j++) {
        totalTimeInSeconds += userDetails.courses[i].coursecontent[
          j
        ].subsections.reduce(
          (acc, curr) => acc + parseInt(curr.timeduration),
          0
        );

        subsectionLength +=
          userDetails.courses[i].coursecontent[j].subsections.length;
      }
      userDetails.courses[i].totalDuration =
        convertSecondsToDuration(totalTimeInSeconds);

      let courseProgressDetail = await CourseProgress.findOne({
        courseid: userDetails.courses[i]._id,
        userid: userid,
      });
      const courseProgressCount = courseProgressDetail?.completevideos.length;
      if (courseProgressCount === subsectionLength) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / subsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
