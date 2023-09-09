import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import rfs from "rotating-file-stream";
import ErrorMiddleware from "./middleWares/Error.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import morgan from "morgan";
import expressSanitizer from "express-sanitizer";
import "./middleWares/auth.js";

config({ path: "./config/config.env" });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// importing middleWares

// const corsOptions = {
//   origin: ["http://one-lms.test"],
//   optionsSuccessStatus: 200,
// };

app.use(cors());
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    key: process.env.KEY,
    secret: process.env.SECRET,
    secure: true,
    httpOnly: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 7 * 24 * 60 * 60,
      autoRemove: "native",
      collectionName: "sessions",
      touchAfter: 12 * 3600,
    }),
    cookie: {
      maxAge: 50 * 365 * 24 * 60 * 60 * 1000,
    },
  })
);

// Create a rotating write stream
let accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "logs"),
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressSanitizer());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.brandName = req.user
    ? req.user.role === "creator"
      ? req.user.brandName
      : req.user.createdBy.brandName
    : null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Creator route imports
import creatorPrimaryRoutes from "./routes/creator/primaryRoute.js";
import creatorCourseRoutes from "./routes/creator/courseRoute.js";
import creatorAuthRoutes from "./routes/creator/authRoutes.js";
import creatorCourseBundleRoutes from "./routes/creator/courseBundleRoutes.js";
import creatorProductRoutes from "./routes/creator/productRoutes.js";
import creatorDiplomaRoutes from "./routes/creator/diplomaRoutes.js";
import creatorQuizRoutes from "./routes/creator/quizRoute.js";
import creatorCouponRoutes from "./routes/creator/couponRoute.js";
import creatorInstructorRoutes from "./routes/creator/instructorRoutes.js";
import creatorSubCreatorRoutes from "./routes/creator/subCreatorRoute.js";
import creatorAnnouncementRoutes from "./routes/creator/announcementRoute.js";
import creatorBannerRoutes from "./routes/creator/bannerRoute.js";
import creatorContactRoutes from "./routes/creator/contactRoute.js";
import creatorTestimonialRoutes from "./routes/creator/testimonialRoute.js";
import creatorFeedbackVideosRoutes from "./routes/creator/feedbackVideoRoute.js";
import creatorNewsLetterRoutes from "./routes/creator/newsLetterRoute.js";
import creatorHelpRoutes from "./routes/creator/helpRoute.js";
import creatorFaqRoutes from "./routes/creator/faqRoute.js";
import creatorBlogRoutes from "./routes/creator/blogRoutes.js";
import creatorSettingRoutes from "./routes/creator/settingRoute.js";
import creatorLearnerRoutes from "./routes/creator/learnerRoute.js";

// Learner Route Import
import learnerPrimaryRoute from "./routes/learner/primaryRoutes.js";
import learnerAuthRoute from "./routes/learner/authRoutes.js";
import learnerCourseRoutes from "./routes/learner/courseRoutes.js";
import learnerBlogRoutes from "./routes/learner/blogRotes.js";
import learnerBundleRoutes from "./routes/learner/bundleRoutes.js";
import learnerProductRoutes from "./routes/learner/productRoutes.js";
import learnerHelpRoutes from "./routes/learner/helpRoutes.js";
import learnerInventoryRoutes from "./routes/learner/inventoryRoutes.js";

// Creators Routes
app.use("/api/creator/auth", creatorAuthRoutes);
app.use("/api/creator", creatorPrimaryRoutes);
app.use("/api/creator/course", creatorCourseRoutes);
app.use("/api/creator/course-bundle", creatorCourseBundleRoutes);
app.use("/api/creator/product", creatorProductRoutes);
app.use("/api/creator/diploma", creatorDiplomaRoutes);
app.use("/api/creator/quiz", creatorQuizRoutes);
app.use("/api/creator/coupon", creatorCouponRoutes);
app.use("/api/creator/instructor", creatorInstructorRoutes);
app.use("/api/creator/sub-creator", creatorSubCreatorRoutes);
app.use("/api/creator/announcement", creatorAnnouncementRoutes);
app.use("/api/creator/banner", creatorBannerRoutes);
app.use("/api/creator/contact", creatorContactRoutes);
app.use("/api/creator/testimonial", creatorTestimonialRoutes);
app.use("/api/creator/feedback", creatorFeedbackVideosRoutes);
app.use("/api/creator/newsletter", creatorNewsLetterRoutes);
app.use("/api/creator/help", creatorHelpRoutes);
app.use("/api/creator/faq", creatorFaqRoutes);
app.use("/api/creator/blog", creatorBlogRoutes);
app.use("/api/creator/setting", creatorSettingRoutes);
app.use("/api/creator/learner", creatorLearnerRoutes);

// Learners Routes
app.use("/api", learnerPrimaryRoute);
app.use("/api/auth", learnerAuthRoute);
app.use("/api/course", learnerCourseRoutes);
app.use("/api/blog", learnerBlogRoutes);
app.use("/api/course-bundle", learnerBundleRoutes);
app.use("/api/product", learnerProductRoutes);
app.use("/api/help", learnerHelpRoutes);
app.use("/api/inventory", learnerInventoryRoutes);

app.get("*", (req, res) => {
  const responseType = req.accepts(["html", "json"]);

  if (responseType === "html") {
    console.log(req.url, ": not found request"); //remove this console
    res.render(__dirname + "/views/creator/auth/page-not-found");
  } else if (responseType === "json") {
    res.status(500).json({
      success: false,
      message: "The resource you are trying to get is not available.",
    });
  }
});

export default app;

app.use(ErrorMiddleware);
