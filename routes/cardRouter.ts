import { Router } from "express";
import { activateCard, createCard, getTransactions, lock, unlock } from "../controllers/cardController.js";
import { verificAPIkey } from "../middlewares/validateKey.js";
import validateSchema from "../middlewares/validateSchema.js";
import activateCardSchema from "../schemas/activateSchema.js";
import passwordSchema from "../schemas/blockUnblockSchema.js";
import createCardSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();

cardRouter.post("/card/create", verificAPIkey, validateSchema(createCardSchema), createCard);
cardRouter.patch("/card/activate/:id", validateSchema(activateCardSchema), activateCard);
cardRouter.get("/card/transactions/:id", getTransactions);
cardRouter.patch("/cards/lock/:id", validateSchema(passwordSchema), lock);
cardRouter.patch("/card/unlock/:id", validateSchema(passwordSchema) ,unlock);

export default cardRouter;