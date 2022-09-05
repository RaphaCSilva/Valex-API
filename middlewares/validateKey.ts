import { NextFunction, Request, Response} from "express";

export async function verificAPIkey(req: Request, res: Response, next: NextFunction) {
    const APIkey = req.headers["x-api-key"].toString();
    if(!APIkey){
        throw { type: "unauthorized", message: "invalid api key"};
    }
    next();
}