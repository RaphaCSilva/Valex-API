import { TransactionTypes } from "../repositories/cardRepository.js";
import { validateAPIkey } from "./utilService.js";

export async function create(APIkey: string, employeeId: number, type: TransactionTypes){
    await validateAPIkey(APIkey);
}