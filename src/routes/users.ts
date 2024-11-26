import { Router } from "express";
import { updateProfile } from '../controllers/users';
import { authMiddleware } from "../middlewares/auth";
import { errorHandlerThis as err_hdl } from '../middlewares/errors';
import { singleFileUpload, uploadMiddleware} from '../middlewares/multer';

const usersRouter: Router = Router();

usersRouter.put("/update-profile", [err_hdl(authMiddleware), singleFileUpload("profiles"), err_hdl(uploadMiddleware)], err_hdl(updateProfile));

export default usersRouter;
