// import AIRequest from "../models/AIRequest.model.js";
import { GoogleGenAI } from '@google/genai';
import { aiPrompt } from '../utils/prompt.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateFormWithAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

        // Add delay to prevent rate limiting (429 errors)
        await delay(1000);

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: aiPrompt(prompt),
        });

        console.log(response);

        // await AIRequest.create({
        //     userId: req.user.id,
        //     type: "form",
        //     prompt,
        //     inputTokens: 500,
        //     outputTokens: 800,
        //     cost: req.aiCost
        // });

        res.json({
            message: "Form generated",
            data: response
        });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: error });
    }
};
