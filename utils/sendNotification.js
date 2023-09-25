import {Notification} from "../models/Notification.js";

export const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId,
      message,
    });

    await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const sendNotification = async (io, content) => {
  try {
    const notification = await Notification.create({ content });

    io.emit("notification",notification)
    // const userSocket = io.sockets.sockets.get(socketId);
    // if (userSocket) {
    //   userSocket.emit("notification", notification);
    // }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};


export const getNotificationsForUser = async (userId) => {
  try {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};
