import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TemporaryGroup",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    activity: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        role: {
          type: String,
          enum: ["organizer", "player"],
          default: "player",
        },
        checkedIn: {
          type: Boolean,
          default: false,
        },
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        trim: true,
        default: "",
      },
      placeName: {
        type: String,
        trim: true,
        default: "",
      },
    },

    time: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
      },
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "cancelled"],
      default: "scheduled",
    },

    completedAt: {
      type: Date,
      default: null,
    },

    ratings: [
      {
        fromUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        toUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        score: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    memoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Memory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ groupId: 1 });
activitySchema.index({ status: 1, "time.start": 1 });
activitySchema.index({ "participants.userId": 1 });
activitySchema.index({ location: "2dsphere" });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;