import { GenerateContentResult } from "@google/generative-ai";
import { Request, Response } from "express";
import { gemini } from '../index';
import { AskGeminiSchema } from '../schemas/ais';

export const askGemini = async (req: Request, res: Response) => {
	let validateData = AskGeminiSchema.parse(req.body);
	let result: GenerateContentResult;
	try {
		result = await gemini.generateContent(validateData.prompt);
		res.json({ content: result });
	} catch (error) {
		console.error(error);
	}
}
