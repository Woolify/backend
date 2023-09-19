import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
    {
        bidder: {
          type: Schema.Types.ObjectId,
          ref: "vendor",
          required: true,
        },
        auction:{
          type: Schema.Types.ObjectId,
          ref:"auction",
          required:true
        },
        description : {
          type: String,
        },
        offeredPrice: {
          type: Number,
          required: true,
        },
      },
      { timestamps: true }
    );

export const Bid = mongoose.model("bid", schema )