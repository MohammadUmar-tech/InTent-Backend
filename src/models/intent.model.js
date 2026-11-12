import mongoose from "mongoose";

const intentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rawText: {
      type: String,
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
      enum: ["sports", "learning", "gaming", "social", "project", "music", "dance", "arts", "fitness", "other"],
      default: "other",
    },

    date: {
      type: Date,
      required: true,
    },

    timeWindow: {
      start: {
        type: String, 
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
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
    },

    radiusKm: {
      type: Number,
      default: 5,
      min: 1,
      max: 50,
    },

    groupSize: {
      min: {
        type: Number,
        default: 2,
      },
      max: {
        type: Number,
        default: 10,
      },
    },

    skillLevel: {
      type: String,
      enum: ["any", "beginner", "intermediate", "advanced"],
      default: "any",
    },

    budget: {
      type: Number,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "matched", "expired", "cancelled"],
      default: "active",
    },

    expiresAt: {
      type: Date,
    },

    matchedUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    matchedGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TemporaryGroup",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for nearby matching
intentSchema.index({ location: "2dsphere" });

// Compound index for faster queries
intentSchema.index({ status: 1, activity: 1, date: 1 });
intentSchema.index({ userId: 1, status: 1 });

const Intent = mongoose.model("Intent", intentSchema);

export default Intent;