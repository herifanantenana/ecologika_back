import { Router } from "express";
import { askGemini, askGeminiChat, askGeminiImage } from '../controllers/ais';
import { errorHandlerThis as err_hdl } from "../middlewares/errors";
import { singleFileUpload } from '../middlewares/multer';
const aisRouter: Router = Router();

aisRouter.post("/ask", err_hdl(askGemini));
aisRouter.post("/ask/image", [singleFileUpload("image")], err_hdl(askGeminiImage));
aisRouter.post("/ask/chat", err_hdl(askGeminiChat));
export default aisRouter
