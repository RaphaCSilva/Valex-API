import { Request, Response } from "express";
import { activateCardService, create, findTransactions, block, unblock } from "../services/cardService.js";


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

export async function getTransactions(req: Request, res: Response){
    const id = req.params.id;

    const transactions = await findTransactions(Number(id));

    res.sendStatus(200).send(transactions);
}

export async function lock(req: Request, res: Response){
    const id = req.params.id;
    const { password } = req.body;

    await block(Number(id), password);

    res.sendStatus(200);
}

export async function unlock(req: Request, res: Response) {
    const id = req.params.id;
    const { password } = req.body;

    await unblock(Number(id), password);

    res.sendStatus(200);
}