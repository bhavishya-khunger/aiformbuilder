import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoutes from "../routes/user.routes.js";
import formRoutes from "../routes/form.routes.js";
import questionRoutes from "../routes/question.routes.js";
import responseRoutes from "../routes/response.routes.js";
import aiRoutes from "../routes/ai.routes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/ai", aiRoutes);

export { app };
