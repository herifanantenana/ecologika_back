import z from "zod";

export const AskGeminiSchema = z.object({
	prompt: z.string()
})
