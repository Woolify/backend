import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as localStrategy } from "passport-local";
import { Creator } from "../models/Creator.js";
import { Learner } from "../models/Learner.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

// Local strategies for creator and admin
passport.use(
  "creatorLocal",
  new localStrategy(async function (username, password, next) {
    try {
      const creator = await Creator.findOne({ email: username }).select(
        "+password"
      );
      if (!creator)
        return next(null, false, { message: "Email is not registered" });

      if (!creator.status)
        return next(null, false, {
          message: "This account is deactivated by admin.",
        });

      let isMatch = await creator.comparePassword(password);
      if (isMatch) {
        return next(null, creator);
      } else {
        return next(null, false, {
          message: "Incorrect credentials, Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

// JWT strategies for learners
let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JWTStrategy(opts, async (token, done) => {
    try {
      const learner = await Learner.findById(token.id);
      if (learner && !learner.status) {
        return done(null, false, { message: "Account has been deactivated" });
      }
      return done(null, token.id);
    } catch (error) {
      console.log(error);
      done(error);
    }
  })
);

//Serializing & DeSerializing for browser session
passport.serializeUser(function (user, next) {
  let key = {
    _id: user._id,
    type: user.type,
  };
  next(null, key);
});

passport.deserializeUser(async function (key, next) {
  let Model;
  switch (key.type) {
    case "admin":
      Model = Admin;
      break;
    case "creator":
      Model = Creator;
      break;
    case "learner":
      Model = Learner;
      break;
    default:
      break;
  }
  try {
    let user;
    if (key.type === "creator") {
      user = await Model.findOne({ _id: key._id }).populate({
        path: "createdBy",
        select: "brandName",
      });
    } else {
      user = await Model.findOne({ _id: key._id });
    }
    next(null, user);
  } catch (error) {
    next(error, false);
  }
});
