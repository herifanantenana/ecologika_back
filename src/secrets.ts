import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT || 3003;
export const JWT_SECRET_KEY = process.env.EMAIL_SECRET_KEY!;
export const EMAIL_SECRET_KEY = process.env.EMAIL_SECRET_KEY!;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;
export const EMAIL_SENDER = process.env.EMAIL_SENDER!;
export const FRONT_URL = process.env.FRONT_URL!;