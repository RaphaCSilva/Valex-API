import { Request, Response } from "express";
import * as cardService from "./../services/cardService.js"

export async function createCard(req: Request, res: Response) {
    const APIkey = req.headers["x-api-key"] as string;
    const {employeeId, type} = req.body;

    await cardService.create(APIkey, employeeId, type);
    res.sendStatus(201)
}