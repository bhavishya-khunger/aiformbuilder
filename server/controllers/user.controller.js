import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// helper
const generateToken = async (userId) => {
    return jwt.sign(
        { user: await User.findById(userId) },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// register
export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            fullname,
            email,
            passwordHash,
            authProvider: "local"
        });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                plan: user.plan,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email }).select("+passwordHash");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Account blocked" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const token = await generateToken(user._id);
        console.log("Token: ", token);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                plan: user.plan,
                credits: user.credits
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// get user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            plan: user.plan,
            credits: user.credits,
            role: user.role,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (fullname) user.fullname = fullname;

        await user.save();

        res.json({
            message: "Profile updated",
            fullname: user.fullname
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// add credits
export const addCredits = async (userId, amount) => {
    await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: amount } }
    );
};

// consume credits
export const consumeCredits = async (userId, amount) => {
    const user = await User.findById(userId);
    if (!user || user.credits < amount) return false;

    user.credits -= amount;
    await user.save();
    return true;
};

// verify token
export const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        res.json({
            message: "Token is valid",
            valid: true,
            userId: decoded.user._id
        });
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(401).json({ 
            message: "Invalid or expired token",
            valid: false
        });
    }
};