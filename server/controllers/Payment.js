const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  try {
    //     console.log("here1 payment");
    const { courses } = req.body;

    const userid = req.user.id;
    //     console.log(userid, courses);

    if (courses.length == 0) {
      return res.status(404).json({
        success: false,
        message: "no course selected",
      });
    }
    let totalAmount = 0;
    for (const courseid of courses) {
      try {
        const courseDetails = await Course.findById(courseid);
        //   console.log("coursedetails is", courseDetails);
        if (!courseDetails) {
          return res.status(404).json({
            success: false,
            message: " course not found",
          });
        }
        //   console.log("here2 payment");
        const uid = new mongoose.Types.ObjectId(userid);
        if (courseDetails.studentsenrolled.includes(uid)) {
          return res.status(404).json({
            success: false,
            message: " student already enrolled in course",
          });
        }

        totalAmount += parseFloat(courseDetails.price);
        console.log("totalAmount is", totalAmount);
      } catch (error) {
        return res.status(404).json({
          success: false,
          message: "network error",
        });
      }
    }
    const currency = "INR";
    const options = {
      amount: totalAmount * 100,
      currency,
      receipt: Math.random(Date.now()).toString(),
    };
    //     console.log(options);
    //     console.log("here3 payment");
    try {
      const paymentResponse = await instance.orders.create(options);
      // console.log(paymentResponse);
      // console.log("here4 payment");
      return res.json({
        success: true,
        message: paymentResponse,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "network error in create payment",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "network error in payment",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);

    return res.status(200).json({ success: true, message: "Payment Verified" });
  }

  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;
  console.log("payments details");
  console.log(userId);
  console.log(orderId);
  console.log(paymentId);
  console.log(amount);

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstname} ${enrolledStudent.lastname}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsenrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseid: courseId,
        userid: userId,
        completevideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseprogress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.coursename}`,
        courseEnrollmentEmail(
          enrolledCourse.coursename,
          `${enrolledStudent.firstname} ${enrolledStudent.lastname}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};
