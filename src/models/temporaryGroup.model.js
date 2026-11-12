import mongoose from "mongoose";

const temporaryGroupSchema = new mongoose.Schema(
  {
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

    category: {
      type: String,
      enum: [
        "sports",
        "learning",
        "gaming",
        "social",
        "project",
        "music",
        "dance",
        "arts",
        "fitness",
        "other",
      ],
      default: "other",
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        status: {
          type: String,
          enum: ["interested", "confirmed", "left"],
          default: "interested",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    targetSize: {
      min: {
        type: Number,
        default: 2,
      },
      max: {
        type: Number,
        default: 15,
      },
    },

    currentConfirmed: {
      type: Number,
      default: 0,
    },

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
      date: {
        type: Date,
        required: true,
      },
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
    },

    skillLevel: {
      type: String,
      enum: ["any", "beginner", "intermediate", "advanced"],
      default: "any",
    },

    costPerPerson: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["forming", "confirmed", "live", "completed", "cancelled"],
      default: "forming",
    },

    chatRoomId: {
      type: String,
      default: null,
    },

    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

temporaryGroupSchema.index({ location: "2dsphere" });
temporaryGroupSchema.index({ status: 1, activity: 1, "time.date": 1 });
temporaryGroupSchema.index({ creatorId: 1 });
temporaryGroupSchema.index({ "members.userId": 1 });

const TemporaryGroup = mongoose.model("TemporaryGroup", temporaryGroupSchema);

export default TemporaryGroup;