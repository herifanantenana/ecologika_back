import { Router } from "express";
import { login, sendAuthLinkEmail, signupAuthLinkEmail } from '../controllers/auth';
import { errorHandlerThis } from '../middlewares/errors';

const authRouter: Router = Router();

authRouter.post("/send_email", errorHandlerThis(sendAuthLinkEmail));
authRouter.post("/signup_email/:token", errorHandlerThis(signupAuthLinkEmail));
authRouter.post("/login", errorHandlerThis(login));

export default authRouter;
