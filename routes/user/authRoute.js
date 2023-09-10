import express from "express";
import {
  registerUser,
  // logoutUser ,
  // userForgotPassword,
  userResetPassword,
  userChangePassword,
} from "../../controllers/user/authController.js";
import passport from "passport";

const router = express.Router();

router.route("/register").post(registerUser)

router
  .route("/login")
  .post(
    passport.authenticate("userLocal", {
      failureRedirect: "/api/user/auth/login",
      failureFlash: true,
      successFlash: `Welcome To Web Admin Dashboard`,
    }),
    (req, res) => {
      res.redirect("/api/user/");
    }
  )

// router
//   .route("/forget-password")
//   .post(userForgotPassword)
//
// router
//   .route("/reset-password/:token")
//   .put(userResetPassword)
//
// router.route("/change-password").put(userChangePassword);

export default router;
