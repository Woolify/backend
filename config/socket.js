import { Server } from "socket.io";
import { initializeMessageHandling } from "../utils/message.js";

const configureSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  initializeMessageHandling(io);

  return io;
};

export default configureSocket;
