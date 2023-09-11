import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    owner:{
      type: Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    capacity: {
      type: String,    
    },
    typeOfWool:{ 
      type: String,
      enum: [ "merino","local indian wool","pashmina","angora","camel","yak","cashmere"],
    },
  },
  { timestamps: true }
);

export const Animal = mongoose.model("animal", schema ) 
