import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "farmer",
      required: true,
    },
    nickName: {
      type: String,    
    },
    slug: {
      type: String,    
    },
    qrImg:{
      type:String,
    }
    age: {
      type: String,    
    },
    weight:{
      type:String,
    },
    type_of_sheep:{ 
      type: String,
      enum: ["nali","deccani","bannur","malpura","gaddi","garole","muzzaffarnagari","mecheri","jaisalmeri","chokla"],
    },    
    descp: {
      type: String,
    },
    saveAsDraft: {
      type: Boolean,
      default: true,
    },    
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Sheep = mongoose.model("sheep", schema ) 
