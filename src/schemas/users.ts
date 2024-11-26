import z from "zod";

export const UpdateProfileSchema = z.object({
	fullname: z.string().optional(),
	username: z.string().optional(),
	profileUrl: z.string().optional(),
})
