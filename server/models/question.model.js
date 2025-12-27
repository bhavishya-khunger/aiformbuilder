import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema(
    {
        label: String,
        value: String,
        isCorrect: Boolean
    },
    { _id: false }
);

const QuestionSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: [
                "short_text",
                "long_text",
                "mcq",
                "checkbox",
                "dropdown",
                "rating",
                "boolean",
                "email",
                "phone",
                "url",
                "number",
                "date",
                "time",
                "linear_scale",
                "multiple_choice_grid",
                "file_upload",
                "yes_no"
            ],
            required: true
        },

        questionText: {
            type: String,
            required: true
        },

        description: String,

        options: [OptionSchema],

        required: {
            type: Boolean,
            default: false
        },

        points: {
            type: Number,
            default: 0
        },

        order: {
            type: Number,
            required: true
        },

        aiGenerated: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

QuestionSchema.index({ formId: 1, order: 1 });

export default mongoose.model("Question", QuestionSchema);
