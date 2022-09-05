import { Request, Response } from "express";
import * as paymenteService from "../services/paymentService.js";

export async function payment(req: Request, res: Response) {
  const { amount, password, businessId } = req.body;
  const id = req.params.cardId;
  await paymenteService.payment(Number(id), amount, password, businessId);
  res.sendStatus(201);
}