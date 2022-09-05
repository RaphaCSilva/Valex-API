import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";

export async function findCard(cardId: number){
    const card = await cardRepository.findById(cardId);
    if (!card){
        throw {type: "not_found"};
    }
    return card;
}

export async function validateAPIkey(APIkey: string){
    const company = await findByApiKey(APIkey);
    if(!company){
        throw { type: "unauthorized" };
    }
}

export function calculaBalance(payments: any, recharges: any) {
    let totalPayments = 0;
    let totalRecharges = 0;
    for (let i = 0; i < payments.length; i++) {
      totalPayments += payments[i].amount;
    }
    for (let i = 0; i < recharges.length; i++) {
      totalRecharges += recharges[i].amount;
    }
    const balance = totalRecharges - totalPayments
    return balance;
}

export function generateCardHolderName(employeeName: string){
    const arrName = employeeName.split(" ");
    const nameFixed = [];
    nameFixed.push(arrName[0].toUpperCase());
    for(let i = 1; i < (arrName.length-1); i++){
        if(arrName[i].length >=3){
            nameFixed.push(arrName[i][0].toUpperCase());
        }
    }
    const lastIndex = arrName.length - 1 
    if(lastIndex>0){
        nameFixed.push(arrName[lastIndex].toUpperCase());
    }
    let cardName = nameFixed.toString();
    return cardName.replace(/,/g, " ");
}

export function validateActivated(password: string | null) {
    if (password === null) {
      throw { type: "bad_request", message: "card inactive" };
    }
}
