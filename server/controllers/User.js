const User = require("../models/User.js");
const OTP = require("../models/Otp.js");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile.js");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender.js");
const passwordUpdated = require("../mail/templates/passwordUpdate.js");

exports.sendOTP = async (req, res) => {
  try {
    console.log("hello");
    console.log(req.body);
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(402).json({
        success: false,
        message: "user already registered.please signup with other credintals",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    console.log("your otp is", otp);
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      result = await OTP.findOne({ otp });
    }
    const otppayload = { email, otp };
    const otpbody = await OTP.create(otppayload);
    console.log(otpbody);
    return res.status(200).json({
      success: true,
      message: "otp sent to your email",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "otp send fail,please try again",
    });
  }
};

exports.signUp = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      accounttype,
      otp,
    } = req.body;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmpassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "error in signup,data is missing",
      });
    }

    if (password != confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "error in signup,password and confirmpassword not match",
      });
    }

    const userexist = await User.findOne({ email });
    if (userexist) {
      return res.status(400).json({
        success: false,
        message: "error in signup,email already registred",
      });
    }
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // if(recentOtp.length===0)
    // {
    //       return res.status(400).json(
    //             {
    //                   success:false,
    //                   message:"error in signup,otp not found",
    //             }
    //       )
    // }
    if (otp != recentOtp?.otp) {
      return res.status(400).json({
        success: false,
        message: "error in signup,otp Invalid",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dob: null,
      contactnumber: null,
      aboutme: null,
    });
    const user = User.create({
      firstname,
      lastname,
      email,
      accounttype,
      password: hashpassword,

      additionaldetails: profileDetails._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstname} ${lastname}`,
    });
    return res.status(200).json({
      success: true,
      message: "user registered succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in signup",
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "login credeintals empty",
      });
    }
    // console.log("hello ji");
    let user = await User.findOne({ email }).populate("additionaldetails");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "first signup",
      });
    }
    // console.log("hello");
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accounttype: user.accounttype,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user = user.toObject();
      (user.token = token), (user.password = undefined);
      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "user logged succesfully",
        user,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "password invalid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "error in login",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userid = req.user.id;

    const userDetails = await User.findById(userid);

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      userid,
      { password: encryptedPassword },
      { new: true }
    );
    console.log(updatedUserDetails);
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstname} ${updatedUserDetails.lastname}`
        )
      );
      console.log("Email sent successfully:", emailResponse);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};
