const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 5 * 60,
  },
});
async function sendverficationemail(email, otp) {
  try {
    console.log("trying to send email");
    const mailResponse = await mailSender(
      email,
      "verfication email",
      otpTemplate(otp)
    );
    console.log("email sent succesfuly", mailResponse);
  } catch (error) {
    console.log("error in sending verfication otp email"), console.log(error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  await sendverficationemail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
