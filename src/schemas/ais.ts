import z from "zod";

export const AskGeminiSchema = z.object({
	prompt: z.string(),
	option: z.object({
		numPhrase: z.number().optional(),
		phrase: z.string().optional(), // Recursive schema for nested options
	})
})

export const AskGeminiImageSchema = z.object({
	prompt: z.string().default("explique cette image"),
	image: z.custom<Express.Multer.File>((value) => {
		return (
			value &&
			typeof value === "object" &&
			"originalname" in value &&
			"buffer" in value &&
			"mimetype" in value
		);
	}, {
		message: "Invalid file. Expected an Express.Multer.File.",
	}),
});

export const AskGeminiChatSchema = z.object({
	prompt: z.string()
});
