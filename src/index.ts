import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { errorMiddleware } from "./middlewares/errors";
import apiRouter from "./routes";
import uploadsRouter from "./routes/uploads";
import { PORT, GEMINI_API_KEY } from './secrets';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app: Express = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const prismaClient = new PrismaClient({
	log: ["query", "error", "warn", "info"]
});
app.use("/api", apiRouter);
app.use("/uploads", uploadsRouter)
app.use(errorMiddleware);
app.listen(PORT, () => console.log("Connected"));

