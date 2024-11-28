import { Router } from "express";
import aisRouter from "./ais";
import authRouter from "./auth";
import usersRouter from "./users";
import stripeRouter from "./stripe";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", usersRouter);
rootRouter.use("/ais", aisRouter);
rootRouter.use("/stripe", stripeRouter);

export default rootRouter;
