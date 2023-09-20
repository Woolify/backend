import mongoose,{Schema} from "mongoose";

const schema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

schema.virtual("formattedTimestamp").get(function () {
  return this.timestamp.toISOString(); // format timestamp
});


export const Message = mongoose.model("message", schema )
