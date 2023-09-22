import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
    {
        initializer: {
          type: Schema.Types.ObjectId,
          ref: "farmer",
          required: true,
        },
        basePrice: {
          type: Number,
          required: true,
        },
        maxPrice:{
          type: Number,
          validate: {
            validator: function (value) {
              return value >= this.basePrice;
            },
            message: "max price cannot be less than base Price",
          },
        },
        woolImg:{
          type:String,
          required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        inventory:{
            type: Schema.Types.ObjectId,
            ref:"inventory",
            required:true,
        },
        status:{
            type: Boolean,
            default : false
        },
        lockedBy:{
          type: Schema.Types.ObjectId,
          ref:"ventor",
        },
        descp:{
          type: String,
        },
        bids: [
          {
            type: Schema.Types.ObjectId,
            ref: "bid",
            required: true,
          },
        ],
      },
      { timestamps: true }
    );

export const Auction = mongoose.model("auction", schema )