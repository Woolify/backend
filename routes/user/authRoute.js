import express from "express";
import {
  loginUser,
  registerUser,
  userForgotPassword,
  userResetPassword,
  userChangePassword,
  sendOtp,
  verifyOtp,
} from "../../controllers/user/authController.js";

const router = express.Router();

router
  .route("/login")
  .post(loginUser);

router
  .route("/register")
  .post(registerUser)

router
  .route("/forget-password")
  .post(userForgotPassword)

router
  .route("/reset-password/:token")
  .put(userResetPassword)

router
  .route("/change-password")
  .put(userChangePassword);

router
  .route("/send-otp")
  .post(sendOtp);

router
  .route("/verify-otp")
  .post(verifyOtp);

export default router;
