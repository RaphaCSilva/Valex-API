import { Router } from "express";
import { recharge } from "../controllers/rechargeController.js";
import { verificAPIkey } from "../middlewares/validateKey.js";
import validateSchema from "../middlewares/validateSchema.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", verificAPIkey, validateSchema(rechargeSchema), recharge);

export default rechargeRouter;