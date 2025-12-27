import mongoose from "mongoose";

const FormStatsSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      unique: true,
      required: true
    },

    totalResponses: {
      type: Number,
      default: 0
    },

    avgScore: Number,

    completionRate: Number,

    lastUpdatedAt: Date
  },
  { timestamps: true }
);

FormStatsSchema.index({ formId: 1 }, { unique: true });

export default mongoose.model("FormStats", FormStatsSchema);
