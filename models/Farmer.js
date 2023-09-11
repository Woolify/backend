import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
     userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    animalData:[
      {
        type: Schema.Types.ObjectId,
        ref:"animal",
      },
    ],
    rating:{
      type:String,
    },
    inventory:{
      type: Schema.Types.ObjectId,
      ref:"inventory",
    }
  }
);

export const Farmer = mongoose.model("farmer",schema); 
