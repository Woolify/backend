import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "farmer",
      // required: true,
    },
    nickName: {
      type: String,    
    },
    slug: {
      type: String,   
      // required:true 
    },
    qrImg:{
      type:String,
    },
    age: {
      type: String,    
    },
    weight:{
      type:String,
    },
    lastShread:{
      type: String,
    },
    type:{
      type: String,
      enum: [ "sheep","goat","yak","camel","rabbit"],
      default:"sheep",
    },
    gender:{
      type: String,
      enum:["male","female"]
    },
    breed:{ 
      type: String,
      // enum: ["nali","deccani","bannur","malpura","gaddi","garole","muzzaffarnagari","mecheri","jaisalmeri","chokla"],
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

export const Animal = mongoose.model("animal", schema ) 
