const User = require("../models/User.js");

const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const passwordUpdated = require("../mail/templates/passwordUpdate");

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "your emailid id not found while resetpassword",
      });
    }
    const token = crypto.randomUUID();
    const updatedetalis = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetpasswordexpire: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    const url = `http://localhost:3000/update-password/${token}`;
    console.log(url);
    await mailSender(email, "resetpassword link", `resetpassword link :${url}`);
    return res.status(200).json({
      success: true,
      message: "email sent succesfully.change   your  password  ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: " error in genrate resetpassword token",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message: " pwd and confirm pwd is not same ",
      });
    }

    const userdetails = await User.findOne({ token: token });
    if (!userdetails) {
      return res.status(400).json({
        success: false,
        message: " reset pwd token is invalid ",
      });
    }
    if (userdetails.resetpasswordexpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: " link is expired ",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashpassword,
      },
      { new: true }
    );
    await mailSender(
      userdetails.email,
      "Password Updated",
      passwordUpdated(
        userdetails.email,
        `${userdetails.firstname} ${" "} ${userdetails.lastname}`
      )
    );
    return res.status(200).json({
      success: true,
      message: " reset password success ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: " error in  reset password ",
    });
  }
};
