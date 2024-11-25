import { compareSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from '..';
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { sendEmail } from '../helpers/email';
import { verifyToken } from '../helpers/jwtToken';
import { LoginSchema, SendAuthLinkEmailSchema, SignupAuthLinkEmailSchema } from '../schemas/auth';
import { EMAIL_SECRET_KEY, FRONT_URL, JWT_SECRET_KEY } from '../secrets';

export const sendAuthLinkEmail = async (req: Request, res: Response) => {
	let validateData = SendAuthLinkEmailSchema.parse(req.body);

	const token = jwt.sign({
		fullname: validateData.fullname,
		username: validateData.username,
		email: validateData.email,
		password: validateData.password
	}, EMAIL_SECRET_KEY, { expiresIn: "5m" });

	const option = {
		to: validateData.email,
		subject: "Authentication Link",
		html: `${FRONT_URL}/${token}`
	}

	let user = await prismaClient.user.findFirst({ where: { email: validateData.email } });
	if (user)
		throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXIST);
	await sendEmail(option);

	res.json({ option, token });
}

export const signupAuthLinkEmail = async (req: Request, res: Response) => {
	let validateData = SignupAuthLinkEmailSchema.parse(req.params);

	const payload: any = verifyToken(validateData.token, EMAIL_SECRET_KEY);

	let user = await prismaClient.user.findFirst({
		where: { email: payload.email },
		omit: { password: true }
	});
	if (user)
		throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXIST);

	user = await prismaClient.user.create({
		data: {
			fullname: payload.fullname,
			username: payload.username,
			email: payload.email,
			password: hashSync(payload.password, 10)
		},
		omit: { password: true }
	})
	const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: "30d" });

	res.json({ user, token });
}

export const login = async (req: Request, res: Response) => {
	let validateData = LoginSchema.parse(req.body);

	let user = await prismaClient.user.findFirst({ where: { email: validateData.email } });
	if (!user)
		throw new NotFoundException("User does not exists!", ErrorCode.USER_NOT_FOUND);
	if (!compareSync(validateData.password, user.password))
		throw new BadRequestsException("Incorrect password!", ErrorCode.INCORRECT_PASSWORD);
	const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: "30d" });
	delete (user as any).password;
	res.json({ user, token });
}
