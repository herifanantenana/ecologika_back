import { Request, Response } from "express";
import { prismaClient } from "..";
import { getUrlFile } from '../helpers/multer';
import { generateXlsx } from '../helpers/xlsx';
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

export const downloadExcel = async (req: Request, res: Response) => {
	const users = await prismaClient.user.findMany({
		select: { id: true, fullname: true, username: true, email: true, profileUrl: true }
	});
	console.log(users);
	const buff = await generateXlsx(users);
	res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
	res.send(buff);
}
