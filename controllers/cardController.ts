import { Request, Response } from "express";
import { activateCardService, create } from "../services/cardService.js";


export async function createCard(req: Request, res: Response) {
    const APIkey = req.headers["x-api-key"] as string;
    const {employeeId, type} = req.body;

    await create(APIkey, employeeId, type);

    res.sendStatus(201)
}

export async function activateCard(req: Request, res: Response){
    const id = req.params.id;
    const { securityCode, password } = req.body;

    await activateCardService(Number(id), securityCode, password);
    
    res.sendStatus(200);
}