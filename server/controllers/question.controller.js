import Question from "../models/question.model.js";
import Form from "../models/form.model.js";

// add question
export const addQuestion = async (req, res) => {
    try {
        const { formId, type, questionText, options, required, points } = req.body;

        if (!formId || !type || !questionText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Ensure ownership
        const form = await Form.findOne({
            _id: formId,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const count = await Question.countDocuments({ formId });

        const question = await Question.create({
            formId,
            type,
            questionText,
            options,
            required,
            points,
            order: count
        });

        res.status(201).json({
            message: "Question added",
            question
        });
    } catch (error) {
        console.error("Add Question Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// update question
export const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const form = await Form.findOne({
            _id: question.formId,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const allowedFields = [
            "type",
            "questionText",
            "description",
            "options",
            "required",
            "points"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                question[field] = req.body[field];
            }
        });

        await question.save();

        res.json({
            message: "Question updated",
            question
        });
    } catch (error) {
        console.error("Update Question Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// delete question
export const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const form = await Form.findOne({
            _id: question.formId,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Question.deleteOne({ _id: question._id });

        res.json({ message: "Question deleted" });
    } catch (error) {
        console.error("Delete Question Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// reorder questions
export const reorderQuestions = async (req, res) => {
    try {
        const { formId, order } = req.body;
        // order = [questionId1, questionId2, ...]

        const form = await Form.findOne({
            _id: formId,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const bulkOps = order.map((questionId, index) => ({
            updateOne: {
                filter: { _id: questionId, formId },
                update: { order: index }
            }
        }));

        await Question.bulkWrite(bulkOps);

        res.json({ message: "Questions reordered" });
    } catch (error) {
        console.error("Reorder Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
