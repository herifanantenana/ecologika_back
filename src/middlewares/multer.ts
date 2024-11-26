import { NextFunction, Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { BadRequestsException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { getPathDestination, secureFolder } from '../helpers/multer';
import { validMimeTypes } from './../helpers/multer';



const upload = multer({
	storage: multer.memoryStorage(),
	fileFilter: async (req, file, callback) => {
		if (validMimeTypes.has(file.mimetype)) {
			const fileDestination = getPathDestination(file.mimetype, file.fieldname)
			try {
				await secureFolder(fileDestination);
			} catch (error) {
				callback(new BadRequestsException("Could not create the folder!", ErrorCode.INVALID_FILE_UPLOAD))
			}
			file.destination = fileDestination;
			file.filename = `${Date.now()}-${file.originalname}`;
			callback(null, true);
		}
		else
			callback(new BadRequestsException("Invalid file type!", ErrorCode.INVALID_FILE_UPLOAD));
	},
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});


export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const afterNext = async () => {
		if (req.file) {
			const filePath = path.join(req.file.destination, req.file.filename);
			try {
				await fs.promises.writeFile(filePath, req.file.buffer);
			} catch (error) {
				throw new BadRequestsException("Can not save file!", ErrorCode.INVALID_FILE_UPLOAD)
			}
		} else if (req.files) {
			try {
				const filePromises = Object.values(req.files).flat().map(async (file) => {
					const filePath = path.join(file.destination, file.filename);
					return await fs.promises.writeFile(filePath, file.buffer);
				});
				await Promise.all(filePromises)
			} catch (error) {
				throw new BadRequestsException("Can not save file!", ErrorCode.INVALID_FILE_UPLOAD)
			}
		}
		next();
	}
	res.locals.next = afterNext;
	next();
}

export const singleFileUpload = (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
	const uploadHandler = upload.single(fieldName);

	uploadHandler(req, res, (err: any) => {
		if (err instanceof multer.MulterError)
			next(new BadRequestsException(err.message, ErrorCode.INVALID_FILE_UPLOAD));
		else if (err)
			next(new BadRequestsException("An error occurred!", ErrorCode.INTERNAL_EXCEPTION));
		next();
	})
}

export const multipleFileUpload = (fieldName: string, maxCount: number = 2) => (req: Request, res: Response, next: NextFunction) => {
	const uploadHandler = upload.array(fieldName, maxCount);

	uploadHandler(req, res, (err: any) => {
		if (err instanceof multer.MulterError)
			next(new BadRequestsException(err.message, ErrorCode.INVALID_FILE_UPLOAD));
		else if (err)
			next(new BadRequestsException("An error occurred!", ErrorCode.INTERNAL_EXCEPTION));
		next();
	})
}

export const fieldsFileUpload = (fields: { name: string, maxCount: number }[]) => (req: Request, res: Response, next: NextFunction) => {
	const uploadHandler = upload.fields(fields);

	uploadHandler(req, res, (err: any) => {
		if (err instanceof multer.MulterError)
			next(new BadRequestsException(err.message, ErrorCode.INVALID_FILE_UPLOAD));
		else if (err)
			next(new BadRequestsException("An error occurred!", ErrorCode.INTERNAL_EXCEPTION));
		next();
	})
}

