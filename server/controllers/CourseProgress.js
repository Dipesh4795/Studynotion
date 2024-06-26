const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const { default: mongoose } = require("mongoose");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userid = req.user.id;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" });
    }
    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({ error: "Invalid course" });
    }

    let courseProgress = await CourseProgress.findOne({
      courseid: courseId,
      userid: userid,
    });

    // { it is also correct}

    // const cid = new mongoose.Types.ObjectId(courseId);
    // const uid = new mongoose.Types.ObjectId(userid);
    // let courseProgress = await CourseProgress.findOne({
    //   courseid: cid,
    //   userid: uid,
    // });

    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      });
    } else {
      if (courseProgress.completevideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" });
      }

      courseProgress.completevideos.push(subsectionId);
    }

    await courseProgress.save();

    return res.status(200).json({ message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
