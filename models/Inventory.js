import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    owner:{
      type: String,
      enum: ["farmer", "vendor","user","artisan","transporter","consultant","service-provider","buyer","admin"],
      default: "farmer",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    capacity: {
      type: String,    
    },
    shreadDate:{
      type: String,
    },
    typeOfWool:{ 
      type: String,
      enum: [ "merino","local indian wool","pashmina","angora","camel","yak","cashmere"],
    },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model("inventory", schema ) 
