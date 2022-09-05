import { Router } from "express";
import { activateCard, createCard, getTransactions } from "../controllers/cardController.js";
import { verificAPIkey } from "../middlewares/validateKey.js";
import validateSchema from "../middlewares/validateSchema.js";
import activateCardSchema from "../schemas/activateSchema.js";
import createCardSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();

cardRouter.post("/card/create", verificAPIkey, validateSchema(createCardSchema), createCard);
cardRouter.patch("/card/activate/:id", validateSchema(activateCardSchema), activateCard);
cardRouter.get("/card/transactions/:id", getTransactions);

export default cardRouter;