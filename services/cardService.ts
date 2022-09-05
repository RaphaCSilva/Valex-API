import * as cardRepository from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import dotenv from "dotenv";
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import { findById } from "../repositories/employeeRepository.js";
import { validateAPIkey } from "./utilService.js";

dayjs.extend(customParseFormat);
dotenv.config();
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

const expirationTimeYears = 5;
const dateFormat = "MM/YY";
const cardFlag = "mastercard";

export async function create(APIkey: string, employeeId: number, type: cardRepository.TransactionTypes){
    await validateAPIkey(APIkey);
    verifyCardAlreadyExist(employeeId, type);
    const employee = await getEmployeeByID(employeeId);
    const cardData = createCardData(employee.fullName, employeeId, type);
    await cardRepository.insert(cardData);
}

async function verifyCardAlreadyExist(employeeId: number,type: cardRepository.TransactionTypes) {
    const alreadyExist = await cardRepository.findByTypeAndEmployeeId(type,employeeId);
    if (alreadyExist) {
      throw { type: "conflict", message: "card for this type already in use"};
    }
}

async function getEmployeeByID(employeeId: number){
    const employee = await findById(employeeId);
    if(!employee) {
        throw { type: "bad_request" };
    }
    return employee;
}

function createCardData(employeeName: string, employeeId: number, type: cardRepository.TransactionTypes){
    return{
        employeeId,
        number: faker.finance.creditCardNumber(cardFlag),
        cardholderName: generateCardHolderName(employeeName),
        securityCode: generateSecurityCode(),
        expirationDate: generateExpirationDate(expirationTimeYears, dateFormat),
        isVirtual: false,
        isBlocked: false,
        type
    }
}

function generateCardHolderName(employeeName: string){
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

function generateSecurityCode(){
    const securityCode = faker.finance.creditCardCVV();
    return cryptr.encrypt(securityCode);
}

function generateExpirationDate(years: number, format: string){
    return dayjs().add(years, "year").format(format);
}