import { Request, Response } from "express";
import { rechargeService } from "../services/rechargeService.js";

export async function recharge(req: Request, res: Response) {
  const { amount } = req.body;
  const APIkey = req.headers["x-api-key"] as string;
  const id = req.params.id;
  
  await rechargeService(Number(id), amount, APIkey);
  res.sendStatus(201);
}