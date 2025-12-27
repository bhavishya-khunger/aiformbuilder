import mongoose from "mongoose";

const FormSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    description: String,

    type: {
      type: String,
      enum: ["form", "quiz"],
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },

    isPublic: {
      type: Boolean,
      default: false
    },

    settings: {
      collectEmail: { type: Boolean, default: false },
      shuffleQuestions: { type: Boolean, default: false },
      timeLimit: Number,
      allowMultipleAttempts: { type: Boolean, default: true }
    },

    aiGenerated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

FormSchema.index({ ownerId: 1, createdAt: -1 });
FormSchema.index({ status: 1 });
FormSchema.index({ isPublic: 1 });

export default mongoose.model("Form", FormSchema);
