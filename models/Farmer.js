import mongoose, { Schema } from "mongoose";
import { Inventory } from "./Inventory.js";

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

schema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }

  const inventory = await Inventory.create({
    ownerId : this.userId,
    owner:"farmer"
  });
  this.ownerId = inventory._id;

  return next();
});

export const Farmer = mongoose.model("farmer",schema); 
