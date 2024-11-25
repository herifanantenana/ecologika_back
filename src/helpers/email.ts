import { createTransport } from "nodemailer";
import { EMAIL_PASSWORD, EMAIL_SENDER } from '../secrets';

export type TOptionEmail =  {
	to: string;
	subject: string;
	html: string;
}

export const sendEmail = (option: TOptionEmail) => {
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: EMAIL_SENDER,
			pass: EMAIL_PASSWORD
		}
	})
	return transporter.sendMail(option)
}
