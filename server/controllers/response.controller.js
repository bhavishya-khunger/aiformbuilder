import Response from "../models/response.model.js";
import Form from "../models/form.model.js";
import Question from "../models/question.model.js";

// submit response
export const submitResponse = async (req, res) => {
    try {
        const { formId, answers, email, startedAt } = req.body;

        const form = await Form.findOne({
            _id: formId,
            status: "published"
        });

        if (!form) {
            return res.status(404).json({ message: "Form not available" });
        }

        // Prevent multiple attempts (if disabled)
        if (!form.settings.allowMultipleAttempts && req.user?.id) {
            const existing = await Response.findOne({
                formId,
                userId: req.user.id
            });

            if (existing) {
                return res.status(403).json({ message: "Multiple attempts not allowed" });
            }
        }

        let score = 0;
        let maxScore = 0;

        if (form.type === "quiz") {
            const questions = await Question.find({ formId });

            questions.forEach(q => {
                maxScore += q.points || 0;
                const userAnswer = answers.find(
                    a => a.questionId === q._id.toString()
                );

                if (!userAnswer) return;

                const correctOptions = q.options
                    ?.filter(o => o.isCorrect)
                    .map(o => o.value);

                if (
                    JSON.stringify(userAnswer.answer) ===
                    JSON.stringify(correctOptions)
                ) {
                    score += q.points || 0;
                }
            });
        }

        const response = await Response.create({
            formId,
            userId: req.user?.id || null,
            email,
            answers,
            score,
            maxScore,
            startedAt,
            submittedAt: new Date(),
            duration: startedAt
                ? Math.floor((Date.now() - new Date(startedAt)) / 1000)
                : null
        });

        res.status(201).json({
            message: "Response submitted",
            responseId: response._id,
            score,
            maxScore
        });
    } catch (error) {
        console.error("Submit Response Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get reponses
export const getFormResponses = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.formId,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const responses = await Response.find({
            formId: form._id
        }).sort({ submittedAt: -1 });

        res.json(responses);
    } catch (error) {
        console.error("Get Responses Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
