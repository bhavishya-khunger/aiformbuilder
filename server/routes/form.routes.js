import express from "express";
import {
    createForm,
    getMyForms,
    getFormById,
    updateForm,
    deleteForm,
    getPublicForm,
    togglePublishForm
} from "../controllers/form.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createForm);
router.get("/me", protect, getMyForms);
router.get("/public/:id", getPublicForm);

router.get("/:id", protect, getFormById);
router.put("/:id", protect, updateForm);
router.patch("/:id/publish", protect, togglePublishForm);
router.delete("/:id", protect, deleteForm);

export default router;
