import { Request, Response } from "express";
import { prismaClient } from "..";
import { getUrlFile } from '../helpers/multer';
import { UpdateProfileSchema } from '../schemas/users';

export const updateProfile = async (req: Request, res: Response) => {
	let validateData = UpdateProfileSchema.parse(req.body);
	return await prismaClient.$transaction(async (tx) => {
		if (req.file)
			validateData.profileUrl = getUrlFile(req, req.file);
		const updatedUser = await tx.user.update({
			where: { id: req.user?.id },
			data: validateData,
			omit: { password: true }
		})
		res.locals.next();
		res.json(updatedUser);
	})
}
