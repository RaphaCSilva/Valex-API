import { Router } from "express";
import { payment } from "../controllers/paymentController.js";
import validateSchema from "../middlewares/validateSchema.js";
import paymentSchema from "../schemas/paymentSchema.js";


const paymentRoute = Router();

paymentRoute.post("/payment/:cardId", validateSchema(paymentSchema), payment);

export default paymentRoute;