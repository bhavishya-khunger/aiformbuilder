import express from "express";
import {
    submitResponse,
    getFormResponses
} from "../controllers/response.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", submitResponse); // public
router.get("/:formId", protect, getFormResponses);

export default router;