import { Router } from "express";
import { errorHandlerThis as err_hdl } from "../middlewares/errors";
import { checkoutComplete, checkoutStripe } from '../controllers/stripe';

const stripeRouter: Router = Router();

stripeRouter.post('/checkout', err_hdl(checkoutStripe));

stripeRouter.get('/complete', err_hdl(checkoutComplete));

export default stripeRouter;
