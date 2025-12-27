import Form from "../models/form.model.js";
import Question from "../models/question.model.js";
import Response from "../models/response.model.js";

// create form
export const createForm = async (req, res) => {
    try {
        const { title, description, type, settings } = req.body;

        if (!title || !type) {
            return res.status(400).json({ message: "Title and type are required" });
        }

        const form = await Form.create({
            ownerId: req.user.id,
            title,
            description,
            type,
            settings
        });

        res.status(201).json({
            message: "Form created",
            form
        });
    } catch (error) {
        console.error("Create Form Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get user forms
export const getMyForms = async (req, res) => {
    try {
        const forms = await Form.find({ ownerId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(forms);
    } catch (error) {
        console.error("Get My Forms Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get single form for owner
export const getFormById = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const questions = await Question.find({ formId: form._id }).sort({ order: 1 });

        res.json({ form, questions });
    } catch (error) {
        console.error("Get Form Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get form for response
export const getPublicForm = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            status: "published"
        });

        if (!form || !form.isPublic) {
            return res.status(404).json({ message: "Form not available" });
        }

        const questions = await Question.find({ formId: form._id })
            .sort({ order: 1 })
            .select("-options.isCorrect"); // hide answers

        res.json({ form, questions });
    } catch (error) {
        console.error("Get Public Form Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// update form
export const updateForm = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const allowedFields = [
            "title",
            "description",
            "settings",
            "isPublic",
            "status"
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                form[field] = req.body[field];
            }
        });

        await form.save();

        res.json({
            message: "Form updated",
            form
        });
    } catch (error) {
        console.error("Update Form Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// publish/unpublish form
export const togglePublishForm = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        form.status = form.status === "published" ? "draft" : "published";

        await form.save();

        res.json({
            message: `Form ${form.status}`,
            status: form.status
        });
    } catch (error) {
        console.error("Publish Toggle Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// delete form
export const deleteForm = async (req, res) => {
    try {
        const form = await Form.findOne({
            _id: req.params.id,
            ownerId: req.user.id
        });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        await Promise.all([
            Question.deleteMany({ formId: form._id }),
            Response.deleteMany({ formId: form._id }),
            Form.deleteOne({ _id: form._id })
        ]);

        res.json({ message: "Form deleted" });
    } catch (error) {
        console.error("Delete Form Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
