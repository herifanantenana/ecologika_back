import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import Stripe from "stripe";
import { errorMiddleware } from "./middlewares/errors";
import apiRouter from "./routes";
import uploadsRouter from "./routes/uploads";
import { GEMINI_API_KEY, PORT, STRIPE_API_KEY } from './secrets';


const app: Express = express();
app.use(express.json());


export const stripe = new Stripe(STRIPE_API_KEY);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const gemini = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const prismaClient = new PrismaClient({
	log: ["query", "error", "warn", "info"]
});
app.use("/api", apiRouter);
app.use("/uploads", uploadsRouter)
app.use(errorMiddleware);
app.listen(PORT, () => console.log("Connected"));

