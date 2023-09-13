import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import flash from "express-flash";
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
// app.use(flash());
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
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressSanitizer());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user || null;
  res.locals.username = req.user
    ? req.user.role === "vendor"
      ? req.user.username
      : req.user.createdBy.username
    : null;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// User route imports
import userAuthRoutes from "./routes/user/authRoute.js";
import userPrimaryRoutes from "./routes/user/primaryRoute.js";

// User Routes
app.use("/api/user/auth", userAuthRoutes);
app.use("/api/user/", userPrimaryRoutes);

// Farmer route imports
import farmerRoutes from "./routes/farmer/primaryRoute.js";
app.use("/api/farmer/", farmerRoutes);

// Bid Route
import bidRoutes from "./routes/bid/bidRoute.js";
app.use("/api/bid/", bidRoutes);

// test route
app.get("/test", (req,res)=>{
  res.status(200).send("Server is up & running...")
})

// fallback route
app.get("*", (req, res) => {
  const responseType = req.accepts(["html", "json"]);

  if (responseType === "html") {
    console.log(req.url, ": not found request"); //remove this console
    res.render(__dirname + "/views/common/page-not-found");
  } else if (responseType === "json") {
    res.status(500).json({
      success: false,
      message: "The resource you are trying to get is not available.",
    });
  }
});

export default app;

app.use(ErrorMiddleware);
