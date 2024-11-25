import z from "zod";

export const SendAuthLinkEmailSchema = z.object({
	fullname: z.string(),
	username: z.string(),
	email: z.string().email(),
	password: z.string().min(8)
})

export const SignupAuthLinkEmailSchema = z.object({
	token: z.string()
});

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});
