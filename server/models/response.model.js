import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    answer: mongoose.Schema.Types.Mixed
  },
  { _id: false }
);

const ResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    email: String,

    answers: [AnswerSchema],

    score: Number,
    maxScore: Number,

    startedAt: Date,
    submittedAt: Date,
    duration: Number
  },
  { timestamps: true }
);

ResponseSchema.index({ formId: 1, submittedAt: -1 });
ResponseSchema.index({ userId: 1 });
ResponseSchema.index({ email: 1 });

export default mongoose.model("Response", ResponseSchema);
