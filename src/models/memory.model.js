import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TemporaryGroup",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    type: {
      type: String,
      enum: ["photo", "video", "note"],
      required: true,
    },

    url: {
      type: String,
      trim: true,
      default: "",
    },

    caption: {
      type: String,
      trim: true,
      default: "",
    },

    taggedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    timestamps: true,
  }
);

memorySchema.index({ activityId: 1 });
memorySchema.index({ groupId: 1 });
memorySchema.index({ uploadedBy: 1 });
memorySchema.index({ createdAt: -1 });
memorySchema.index({ taggedUsers: 1 });

const Memory = mongoose.model("Memory", memorySchema);
export default Memory;