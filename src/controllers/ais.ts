import { GenerateContentResult } from "@google/generative-ai";
import { Request, Response } from "express";
import { InternalException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { fileToGenerativePart, sendContentHtml } from '../helpers/ais';
import { gemini } from '../index';
import { AskGeminiChatSchema, AskGeminiImageSchema, AskGeminiSchema } from '../schemas/ais';

export const askGemini = async (req: Request, res: Response) => {
	let validateData = AskGeminiSchema.parse(req.body);
	let result: GenerateContentResult;
	try {
		result = await gemini.generateContent(validateData.prompt.concat("\n reponse: just une paragraph"));
	} catch (error: any) {
		throw new InternalException(error.message, ErrorCode.UNPROCESSABLE_ENTITY, error);
	}
	const contentResult = result?.response?.candidates ? result.response.candidates[0].content.parts[0].text : null;
	sendContentHtml(res, contentResult!);
}

export const askGeminiImage = async (req: Request, res: Response) => {
	let validateData = AskGeminiImageSchema.parse({ prompt: req.body.prompt, image: req.file! });
	let result: GenerateContentResult;
	try {
		const imagePart = fileToGenerativePart(validateData.image.buffer, validateData.image.mimetype);
		result = await gemini.generateContent([validateData.prompt, imagePart]);
	} catch (error: any) {
		throw new InternalException(error.message, ErrorCode.UNPROCESSABLE_ENTITY, error);
	}
	const contentResult = result.response.text();
	sendContentHtml(res, contentResult!);
}

export const askGeminiChat = async (req: Request, res: Response) => {
	let validateData = AskGeminiChatSchema.parse(req.body);
	let result: GenerateContentResult;
	const chat = gemini.startChat({
		history: [
			{
				role: "user",
				parts: [{ text: "Bonjour" }],
			},
			{
				role: "model",
				parts: [{ text: "Enchanté de vous rencontrer. Que souhaitez-vous savoir sur l'aggro-business ?" }],
			},
		],
	});
	try {
		result = await chat.sendMessage(validateData.prompt);
	} catch (error: any) {
		throw new InternalException(error.message, ErrorCode.UNPROCESSABLE_ENTITY, error);
	}
	const contentResult = result.response.text();
	sendContentHtml(res, contentResult!);
}
