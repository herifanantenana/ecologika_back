import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", usersRouter);

export default rootRouter;
