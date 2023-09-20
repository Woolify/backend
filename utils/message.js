const connectedSockets = {};

export const initializeMessageHandling = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    connectedSockets[socket.id] = socket;

    socket.on("message", (data) => {
      console.log("Received message:", data);

      const replyMessage = {
        senderId: data.receiverId,
        receiverId: data.senderId,
        content: data,
      };

      socket.emit("message", replyMessage);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      delete connectedSockets[socket.id];
    });
  });
};

export const sendMessageToUser = (userId, message) => {
  const socket = Object.values(connectedSockets).find((sock) => {
    return sock.userId === userId;
  });

  if (socket) {
    socket.emit("message", message);
  }
};
