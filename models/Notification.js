import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: {
    type:String,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

export const Notification = mongoose.model("notification", schema )