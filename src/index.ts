import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { errorMiddleware } from "./middlewares/errors";
import apiRouter from "./routes";
import uploadsRouter from "./routes/uploads";
import { PORT } from "./secrets";

const app: Express = express();
app.use(express.json());



export const prismaClient = new PrismaClient({
	log: ["query", "error", "warn", "info"]
});
app.use("/api", apiRouter);
app.use("/uploads", uploadsRouter)
app.use(errorMiddleware);
app.listen(PORT, () => console.log("Connected"));

