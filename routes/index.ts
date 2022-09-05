import { Router } from "express";
import cardRouter from "./cardRouter.js";
import paymentRoute from "./paymentRouter.js";

const router = Router();
router.use(cardRouter);
router.use(paymentRoute);

export default router;