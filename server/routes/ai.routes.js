import express from "express";
import { generateFormWithAI } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { requireCredits } from "../middlewares/credits.middleware.js";

const router = express.Router();

// Costs 5 credits
router.post(
  "/generate-form",
  protect,
  requireCredits(),
  generateFormWithAI
);

export default router;
