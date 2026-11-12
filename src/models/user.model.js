import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    locationUpdatedAt: {
      type: Date,
    },

    skills: [
      {
        name: {
          type: String,
          trim: true,
        },
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced"],
          default: "Beginner",
        },
      },
    ],

    preferences: {
      maxDistanceKm: {
        type: Number,
        default: 5,
      },
      preferredTimes: {
        type: [String],
        default: [],
      },
      lookingFor: {
        type: [String],
        default: [],
      },
    },

    currentGoals: {
      type: [String],
      default: [],
    },

    reputation: {
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalActivities: {
        type: Number,
        default: 0,
      },
      completedActivities: {
        type: Number,
        default: 0,
      },
    },

    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    socketId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("user", userSchema);
