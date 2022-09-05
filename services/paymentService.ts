import * as businessRepository from "../repositories/businessRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { calculaBalance, findCard } from "./utilService.js";
import { validateActivated, validateBlocked, validateExpiration, verifyPassword } from "./cardService.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function paymentService(cardId: number, amount: number, password: string, businessId: number){
    const card = await findCard(cardId);
    const business = await findBusinessById(businessId);
    validateActivated(card.password);
    validateExpiration(card.expirationDate);
    validateBlocked(card.isBlocked);
    verifyPassword(password, card.password);
    validateType(card.type, business.type);
    const payments = await paymentRepository.findByCardId(cardId);
    const recharges = await rechargeRepository.findByCardId(cardId);
    const balance = calculaBalance(payments, recharges);
    validateAmountWithBalance(amount, balance);
    
    await paymentRepository.insert({
        cardId,
        businessId,
        amount
    })

}

async function findBusinessById(businessId: number) {
    const business = await businessRepository.findById(businessId);
    if (!business) {
      throw { type: "not_found", message: "BusinessId not registered" };
    }
    return business;
}

function validateType(cardType: TransactionTypes, businessTypes: TransactionTypes){
    if(cardType !== businessTypes){
        throw {
            type: "unauthorized", message: "wrong type for this card"
        }
    }
}

function validateAmountWithBalance(amount: number, balance: number){
    if(amount > balance){
        throw {
            type: "unauthorized", message: "insufficient balance"
        }
    }
}