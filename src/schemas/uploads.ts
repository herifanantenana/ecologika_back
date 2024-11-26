import z from "zod";

export const UploadsSchema = z.object({
	mimetype: z.string(),
	folder: z.string(),
	filename: z.string(),
})
