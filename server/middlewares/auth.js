const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(500).json({
        message: "token is missing,please login again",
      });
    }
    console.log(token);
    try {
      console.log(process.env.JWT_SECRET);
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      console.log(decode);

      req.user = decode;
    } catch (error) {
      return res
        .status(400)
        .json({ console: log(error), message: "token is invalid" });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,

      message: "somthing is cause error to validate token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Student") {
      return res.status(400).json({
        success: false,
        message: "you are not allowed to enter into studentpage",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      console: log(error),
      message: "somthing is cause error to validate Student",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Instructor") {
      return res.status(400).json({
        success: false,
        message: "you are not allowed to enter into Instuctorpage",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      console: log(error),
      message: "somthing is cause error to validate Instructor",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accounttype !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "you are not allowed to enter into Adminpage",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,

      message: "somthing is cause error to validate Admin",
    });
  }
};
