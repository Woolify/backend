import ErrorHandler from "../../utils/ErrorHandler.js";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Creator } from "../../models/User.js";
import slugify from "slugify";
import { sendResponse } from "../../utils/sendResponse.js";
// import { sendEmail } from "../../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    token,
    role,
    username,
    password,
    confirmPassword,
    phone,
    email,
  } = req.body;

  let user = await User.findOne({ username });
  if (user) {
    return next(new ErrorHandler("Email already registered.", 409));
  }
  if (phone.length < 10) {
    return next(new ErrorHandler("Please enter valid phone number.", 422));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does't match.", 422)
    );
  }

  let _user = {
    firstName,
    lastName,
    token,
    username,
    password,
    phone,
    password,
    slug: slugify(username, { lower: true }),
    role,
  };

  if (email) {
    _user.email=email;
  }

  // TODO: Update slug in update profile controller
  user = await User.create(_user);

  req.flash("success", "Registration successful.");
  res.redirect("/api/user/auth/login");
});

export const userForgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new ErrorHandler("Account with this email doesn't exist.", 409)
    );
  }

  const resetToken = await user.getResetToken();

  await user.save();

  // Send token via email
  const url = `${process.env.CREATOR_URL}/api/user/auth/reset-password/${resetToken}`;
  const data = `<p>Click on the link to reset Password.</p> <a class="d-block" href="${url}">Click Here</a> <p>If you have not requested then please ignore. </p>`;
  const { response } = await sendEmail({
    to: user.email,
    subject: `${user.username}, Forgot Password request.`,
    html: data,
  });

  console.log(response);

  req.flash(
    "success",
    "Resent password link send to your registered email id."
  );
  res.redirect("/api/user/auth/login");
});

// Reset password
export const userResetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does't match", 400)
    );

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user)
    return next(new ErrorHandler("Token is invalid or has been expired.", 401));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  user.save();

  req.flash("success", "Password reset successfully.");
  res.sendStatus(200);
});

// Logout
// export const logoutUser= (req, res, next) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(new ErrorHandler("Unable to logout, please try again.", 302));
//     }
//     req.flash("success", "Logged out successfully.");
//     res.redirect("/api/user/auth/login");
//   });
// };

// change password
export const userChangePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does't match", 400)
    );

  const user = await User.findOne({ email: req.user.email }).select(
    "+password"
  );
  const correctPass = await user.comparePassword(currentPassword);

  if (!correctPass) {
    return next(new ErrorHandler("Incorrect password", 401));
  }

  user.password = newPassword;
  await user.save();

  req.flash("success", "Password updated successfully.");
  res.redirect("/api/user/profile");
});
