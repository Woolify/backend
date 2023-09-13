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
        descp:{
          type: String,
        },
        bids: [
          {
            bidder: {
              type: Schema.Types.ObjectId,
              ref: "vendor",
              required: true,
            },
            offeredPrice: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      { timestamps: true }
    );

export const Bid = mongoose.model("bid", schema )