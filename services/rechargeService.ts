import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { validateExpiration, validateActivated } from "./cardService.js";
import { findCard, validateAPIkey } from "./utilService.js";

export async function rechargeService(cardId: number, amount: number, APIkey: string) {
    await validateAPIkey(APIkey);
    const card = await findCard(cardId);
    validateExpiration(card.expirationDate);
    validateActivated(card.password);
    await rechargeRepository.insert({
        cardId,
        amount
    })
}