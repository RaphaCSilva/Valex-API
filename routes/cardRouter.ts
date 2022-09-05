import { Router } from "express";
import { createCard } from "../controllers/cardController.js";
import { verificAPIkey } from "../middlewares/validateKey.js";
import validateSchema from "../middlewares/validateSchema.js";
import createCardSchema from "../schemas/createCardSchema.js";

const cardRouter = Router();

cardRouter.post("/card/create", verificAPIkey, validateSchema(createCardSchema), createCard);
cardRouter.patch("/card/activate/:id");
cardRouter.get("/card/transactions/:id");

export default cardRouter;