import mongoose from "mongoose";
import Form from "../models/form.model.js";
import Question from "../models/question.model.js";
import User from "../models/user.model.js";

const run = async () => {
    try {
        const user = await User.findById("694b00b6b0dc69116e23a14b");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(user);
    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

run();