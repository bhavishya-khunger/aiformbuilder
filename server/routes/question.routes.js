import express from "express";
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions
} from "../controllers/question.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addQuestion);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);
router.post("/reorder", protect, reorderQuestions);

export default router;
