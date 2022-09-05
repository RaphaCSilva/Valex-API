import { Request, Response } from "express";
import { paymentService } from "../services/paymentService.js";


export async function payment(req: Request, res: Response) {
  const { amount, password, businessId } = req.body;
  const id = req.params.cardId;

  await paymentService(Number(id), amount, password, businessId);

  res.sendStatus(201);
}