import User from "../models/user.model.js";

export const requireCredits = (cost = 1) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            if (user.credits < cost) {
                return res.status(402).json({
                    message: "Insufficient AI credits"
                });
            }

            // Deduct credits BEFORE AI call
            user.credits -= cost;
            await user.save();

            req.aiCost = cost; // useful for logging
            next();
        } catch (error) {
            console.error("Credits Middleware Error:", error);
            res.status(500).json({ message: "Server error" });
        }
    };
};
