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
    quantity: {
      type: Number,
      required:true    
    },
    typeOfWool:{ 
      type: String,
      enum: [ "merino","local indian wool","pashmina","angora","camel","yak","cashmere"],
    },
    color:{
      type: String,
      enum:[ "white","black","grey","brown","tan","beige","cream","fawn","chocolate","russet","silver"]
    },
    listed: {
      type: Number,
      validate: {
        validator: function (value) {
          return value <= this.quantity;
        },
        message: "Listed quantity cannot be greater than quantity",
      },
    },
    deleted:{
      type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model("inventory", schema ) 
