import { Router } from "express";
import { askGemini } from '../controllers/ais';
import { errorHandlerThis as err_hdl } from "../middlewares/errors";
const aisRouter: Router = Router();

aisRouter.post("/ask", err_hdl(askGemini));
export default aisRouter
