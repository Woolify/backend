import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
    {
        from: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        to: {
          type: Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        amount: {
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
            type: String,
            enum: ["complete","pending"],
            default : "complete"
        },
        remark:{
          type: String,
        },
      },
      { timestamps: true }
    );

export const Transaction = mongoose.model("transaction", schema )