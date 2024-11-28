import { compareSync, hashSync } from "bcrypt";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { prismaClient } from '..';
import { BadRequestsException, NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { sendEmail } from '../helpers/email';
import { verifyToken } from '../helpers/jwtToken';
import { LoginSchema, SendAuthLinkEmailSchema, SignupAuthLinkEmailSchema } from '../schemas/auth';
import { EMAIL_SECRET_KEY, JWT_SECRET_KEY } from '../secrets';

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
		// html: `${FRONT_URL_AUTH_CONFIRM_LINK}/${token}`
		html: ` <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation de Signup</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
            <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google Logo" style="width: 150px;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                        <h1 style="color: #333333; font-size: 24px; margin: 0;">Merci de vous être inscrit !</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                            Nous sommes ravis de vous compter parmi nous. Votre compte a été créé avec succès.
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                            Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                            Cordialement,<br>
                            L'équipe Google et tay be an${validateData.email} en ${validateData.password} en ${validateData.fullname} en ${validateData.username}
                        </p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding: 20px; background-color: #f4f4f4;">
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                            © 2023 Google. Tous droits réservés.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `
	}

	let user = await prismaClient.user.findFirst({ where: { email: validateData.email } });
	if (user)
		throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXIST);
	await sendEmail(option);
	res.sendStatus(200);
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
