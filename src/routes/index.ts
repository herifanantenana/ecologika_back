import { Router } from "express";
import aisRouter from "./ais";
import authRouter from "./auth";
import usersRouter from "./users";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", usersRouter);
rootRouter.use("/ais", aisRouter);

export default rootRouter;
