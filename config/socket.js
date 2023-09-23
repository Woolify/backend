import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleWares/socketAuth.js";
import { initializeMessageHandling } from "../utils/message.js";
import { sendNotification } from "../utils/sendNotification.js";

export let io;
export const configureSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.use(socketAuthMiddleware)

  // initializeMessageHandling(io);

  io.on("connection", (socket) => {
    console.log(`User connected: socket ID ${socket.id}, User ID ${socket.user._id}`);

    socket.on("notification", ({ userId, content }) => {
      sendNotification(io, userId, content);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const attachSocketToRequest = (req,res,next) => {
  req.io = io;
  next();
};
