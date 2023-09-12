import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const authorizedUser = (req, res, next) => {
  if (req.user && req.user.type === "user") {
    return next();
  }
  req.flash("error", "Please authenticate first!");
  return res.redirect("/api/user/auth/login");
};

export const checkUserModuleAccess = (moduleName) => {
  return (req, res, next) => {
    if (req.user.role === "user" || req.user.modules.includes(moduleName)) {
      next();
    } else {
      req.flash("error", "Don't have access to this module!");
      return res.redirect("/api/user/auth/login");
    }
  };
};
export const extractUserInfo = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next();
  }

  try {
    const jwtToken = authHeader.match(/^Bearer (.+)/)[1];
    const decodedHeader = jwt.decode(jwtToken, { complete: true });

    if (!decodedHeader || !decodedHeader.payload.id) {
      return next();
    }

    const user = await User.findById(decodedHeader.payload.id);

    if (user) {
      req.user = user;
      res.status(200).json({user : req.user})
    } else {
      console.error('User not found');
      next();
    }
  } catch (error) {
    console.error('Error extracting user info:', error);
    next();
  }

};