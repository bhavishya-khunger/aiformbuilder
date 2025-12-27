import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  verifyToken
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { run } from "../scripts/createSampleForm.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Check Token
router.post("/verifytoken", verifyToken);

// Login
router.post("/login", loginUser);

// Get current user
router.get("/me", protect, getCurrentUser);

// Update profile
router.put("/me", protect, updateProfile);

router.get("/loadsample", run)

// router.post("/oauth/google", googleAuth);
// router.post("/logout", protect, logoutUser);
// router.get("/admin/users", protect, isAdmin, getAllUsers);


export default router;
