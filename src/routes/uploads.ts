import { Request, Response, Router } from "express";
import fs from "fs";
import path from "path";
import { NotFoundException } from '../exceptions/internal-exception';
import { ErrorCode } from '../exceptions/root';
import { errorHandlerThis as err_hdl } from "../middlewares/errors";
import { UploadsSchema } from '../schemas/uploads';
const uploadsRouter: Router = Router();

uploadsRouter.get("/:mimetype/:folder/:filename", err_hdl((req: Request, res: Response) => {
	let validateData = UploadsSchema.parse(req.params);
	const filePath = path.join(__dirname, `../../uploads/${validateData.mimetype}/${validateData.folder}/${validateData.filename}`);
	if (!fs.existsSync(filePath)) {
		throw new NotFoundException("File not found!", ErrorCode.FILE_NOT_FOUND);
	}
	res.sendFile(filePath);
}))

export default uploadsRouter;
