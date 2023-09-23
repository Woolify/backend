import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  const authHeader = socket.handshake.headers['authorization'];

  if (!authHeader) {
    return next(new Error("Unauthorized user"));
  }

  try {
    const jwtToken = authHeader.match(/^Bearer (.+)/)[1];
    const decodedHeader = jwt.decode(jwtToken, { complete: true });

    if (!decodedHeader || !decodedHeader.payload.id) {
      return next(new Error("Unauthorized user"));
    }

    const user = await User.findById(decodedHeader.payload.id);

    if (user) {
      socket.user = user;
      user.socketId = socket.id;
      user.save();
      return next();
    } else {
      return next(new Error("Unauthorized user"));
    }
  } catch (error) {
    console.error('Error extracting user info:', error);
    return next(new Error("Unauthorized user"));
  }
};
