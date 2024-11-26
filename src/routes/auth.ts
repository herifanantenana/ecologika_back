import { Router } from "express";
import { login, sendAuthLinkEmail, signupAuthLinkEmail } from '../controllers/auth';
import { errorHandlerThis as err_hdl } from '../middlewares/errors';

const authRouter: Router = Router();

authRouter.post("/send-email", err_hdl(sendAuthLinkEmail));

authRouter.post("/signup-email/:token", err_hdl(signupAuthLinkEmail));

authRouter.post("/login", err_hdl(login));

export default authRouter;
